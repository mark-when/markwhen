import { DateTime } from "luxon"
import { Cascade, DateRange, Event, EventDescription, Tags } from "./Types"

const ISO8601_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}(?:\.\d*)?Z/
const NOW_REGEX = /now/
const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?/

const START_OR_END_TIME_REGEX = new RegExp(`(${ISO8601_REGEX.source})|(${NOW_REGEX.source})|(${DATE_REGEX.source})`)

const EVENT_START_REGEX = new RegExp(`^(\\s*)((${START_OR_END_TIME_REGEX.source})(?:\\s*-\\s*(${START_OR_END_TIME_REGEX.source}))?):(.*)`)
const COMMENT_REGEX = /^\s*\/\/.*/
const TAG_COLOR_REGEX = /^\s*#(\w*):\s*(\S+)/
const DATE_FORMAT_REGEX = /dateFormat:\s*d\/M\/y/
const TAG_REGEX = /(?:^| )#(\w*)/g

export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
export const sorts = ["none", "down", "up"]
export type Sort = "none" | "down" | "up"

const AMERICAN_DATE_FORMAT = 'M/d/y'
const EUROPEAN_DATE_FORMAT = 'd/M/y'

export function parse(eventsString?: string, sort: Sort = "none"): Cascade {

  if (!eventsString) {
    return {
      events: [],
      tags: {},
      metadata: {
        earliestTime: DateTime.now().minus({ years: 5 }),
        latestTime: DateTime.now().plus({ years: 5 }),
        dateFormat: AMERICAN_DATE_FORMAT
      }
    }
  }

  const lines = eventsString.split('\n')
  const events = [] as (Event | Event[])[]
  const tags = {} as Tags
  let paletteIndex = 0
  let dateFormat = AMERICAN_DATE_FORMAT
  let earliest: DateTime | null = null, latest: DateTime | null = null

  // For events that are indented and grouped
  let eventSubgroup = []

  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i]
    if (line.match(COMMENT_REGEX)) {
      continue
    }
    const tagColorMatch = line.match(TAG_COLOR_REGEX)
    if (tagColorMatch) {
      tags[tagColorMatch[1]] = tagColorMatch[2]
      continue
    }
    if (line.match(DATE_FORMAT_REGEX)) {
      dateFormat = EUROPEAN_DATE_FORMAT
      continue
    }
    const matches = line.matchAll(TAG_REGEX)
    if (matches) {
      for (let m of matches) {
        if (!tags[m[1]]) {
          tags[m[1]] = COLORS[paletteIndex++ % COLORS.length]
        }
      }
    }
    const eventStart = line.match(EVENT_START_REGEX)
    if (eventStart) {
      let end = i
      let nextLine
      do {
        nextLine = lines[++end]
      } while (typeof nextLine === 'string' && !nextLine.match(EVENT_START_REGEX))
      const eventGroup = lines.slice(i, end).filter(l => l && !l.match(COMMENT_REGEX))

      // Initial date range and first line description
      const firstLine = eventGroup[0]

      // What the regex matched as the date range part
      const isIndented = !!eventStart[1]
      const datePart = eventStart[2]
      const eventStartDate = eventStart[3] || eventStart[6]
      const eventEndDate = eventStart[9] || eventStart[12]

      // Remove the date part from the first line
      eventGroup[0] = eventGroup[0].substring(eventGroup[0].indexOf(datePart) + datePart.length + 1).trim()
      const dateRange = new DateRange(eventStartDate, eventEndDate, datePart, dateFormat)
      const eventDescription = new EventDescription(eventGroup)
      const event = new Event(firstLine, dateRange, eventDescription)
      if (event) {
        if (isIndented) {
          eventSubgroup.push(event)
        } else {
          if (eventSubgroup.length) {
            events.push(eventSubgroup)
            eventSubgroup = []
          }
          events.push(event)
        }
        if (!earliest || dateRange.fromDateTime < earliest) {
          earliest = dateRange.fromDateTime
        }
        if (!latest || dateRange.toDateTime > latest) {
          latest = dateRange.toDateTime
        }
      }
    }
  }

  if (eventSubgroup.length) {
    events.push(eventSubgroup)
  }

  if (!earliest) {
    earliest = DateTime.now().minus({ years: 5 })
  }
  if (!latest) {
    latest = DateTime.now().plus({ years: 5 })
  }
  if (sort !== "none") {
    sortEvents(events, sort)
  }
  return {
    events, tags, metadata: {
      earliestTime: earliest,
      latestTime: latest,
      dateFormat
    }
  }
}

function sortEvents(events: (Event | Event[])[], sort: Sort) {
  if (sort === 'none') {
    return events
  }

  const sortingDown = sort === 'down'

  const sortDownDateTime = function (dateTime1: DateTime, dateTime2: DateTime) {
    return +dateTime1 - +dateTime2
  }

  const sortUpDateTime = function (dateTime1: DateTime, dateTime2: DateTime) {
    return +dateTime2 - +dateTime1
  }

  const sortDown = function (event1: Event, event2: Event) {
    return sortDownDateTime(event1.range.fromDateTime, event2.range.fromDateTime)
  }

  const sortUp = function (event1: Event, event2: Event) {
    return sortUpDateTime(event1.range.fromDateTime, event2.range.fromDateTime)
  }

  events.sort((eventOrEvents1, eventOrEvents2) => {
    if (eventOrEvents1 instanceof Event) {
      if (eventOrEvents2 instanceof Event) {
        return sortingDown ? sortDown(eventOrEvents1, eventOrEvents2) : sortUp(eventOrEvents1, eventOrEvents2)
      } else {
        const range = sortAndGetRange(eventOrEvents2, sort)
        return sortingDown ? sortDownDateTime(eventOrEvents1.range.fromDateTime, range[0]) : sortUpDateTime(eventOrEvents1.range.fromDateTime, range[0])
      }
    }

    // eventOrEvents1 is array of sub events

    const events1Range = sortAndGetRange(eventOrEvents1, sort)
    if (eventOrEvents2 instanceof Event) {
      return sortingDown ? sortDownDateTime(events1Range[0], eventOrEvents2.range.fromDateTime) : sortUpDateTime(events1Range[0], eventOrEvents2.range.fromDateTime)
    }

    const events2Range = sortAndGetRange(eventOrEvents2, sort)
    return sortingDown ? sortDownDateTime(events1Range[0], events2Range[0]) : sortUpDateTime(events1Range[0], events2Range[0])
  })
}

function sortAndGetRange(events: Event[], sort: Sort): [DateTime, DateTime] {

  let min: DateTime, max: DateTime

  const sortDown = function (event1: Event, event2: Event) {
    if (!min) {
      min = event1.range.fromDateTime
    }
    if (!max) {
      max = event1.range.fromDateTime
    }
    min = dateTimeMin(event1.range.fromDateTime, event2.range.fromDateTime, min)
    max = dateTimeMax(event1.range.fromDateTime, event2.range.fromDateTime, max)

    return +event1.range.fromDateTime - +event2.range.fromDateTime
  }
  const sortUp = function (event1: Event, event2: Event) {
    if (!min) {
      min = event1.range.fromDateTime
    }
    if (!max) {
      max = event1.range.fromDateTime
    }
    min = dateTimeMin(event1.range.fromDateTime, event2.range.fromDateTime, min)
    max = dateTimeMax(event1.range.fromDateTime, event2.range.fromDateTime, max)

    return +event2.range.fromDateTime - +event1.range.fromDateTime
  }
  events.sort(sort === "down" ? sortDown : sortUp)

  return [min!, max!]
}

function dateTimeMin(a: DateTime, b: DateTime, c: DateTime): DateTime {
  if (a < b && a < c) {
    return a
  }
  if (b < a && b < c) {
    return b
  }
  if (a == b) {
    return a < c ? a : c
  }
  if (b == c) {
    return b < a ? b : a
  }
  if (a == c) {
    return a < b ? a : b
  }
  return c
}

function dateTimeMax(a: DateTime, b: DateTime, c: DateTime): DateTime {
  if (a > b && a > c) {
    return a
  }
  if (b > a && b > c) {
    return b
  }
  if (c > a && c > b) {
    return c
  }
  if (a == b) {
    return a > c ? a : c
  }
  if (b == c) {
    return b > a ? b : a
  }
  if (a == c) {
    return a > b ? a : b
  }
  return c
}