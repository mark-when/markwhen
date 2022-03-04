import { DateTime } from "luxon"
import { Cascade, DateRange, Event, EventDescription, Tags } from "./Types"

const ISO8601_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}(?:\.\d*)?Z/
const NOW_REGEX = /now/
const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?/

const START_OR_END_TIME_REGEX = new RegExp(`(${ISO8601_REGEX.source})|(${NOW_REGEX.source})|(${DATE_REGEX.source})`)

const EVENT_START_REGEX = new RegExp(`^\\s*((${START_OR_END_TIME_REGEX.source})(?:\\W*-\\W*(${START_OR_END_TIME_REGEX.source}))?):(.*)`)
const COMMENT_REGEX = /^\s*\/\/.*/
const TAG_COLOR_REGEX = /^\s*#(\w*):\s*(\S+)/
const DATE_FORMAT_REGEX = /dateFormat:\s*d\/M\/y/
const TAG_REGEX = /(?:^| )#(\w*)/g
export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
export const sorts = ["none", "down", "up"]
export type Sort = "none" | "down" | "up"

const AMERICAN_DATE_FORMAT = 'M/d/y'
const EUROPEAN_DATE_FORMAT = 'd/M/y'

// const EVENT_START_REGEX = /^\s*(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now)(-(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now))?:/
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
  const events = [] as Event[]
  const tags = {} as Tags
  let paletteIndex = 0
  let dateFormat = AMERICAN_DATE_FORMAT
  let earliest: DateTime | null = null, latest: DateTime | null = null

  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i].trim()
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
      const datePart = eventStart[1]
      const eventStartDate = eventStart[2] || eventStart[5]
      const eventEndDate = eventStart[8] || eventStart[11]

      // Remove the date part from the first line
      eventGroup[0] = eventGroup[0].substring(eventGroup[0].indexOf(datePart) + datePart.length + 1).trim()
      const dateRange = new DateRange(eventStartDate, eventEndDate, datePart, dateFormat)
      const eventDescription = new EventDescription(eventGroup)
      const event = new Event(firstLine, dateRange, eventDescription)
      if (event) {
        events.push(event)
        if (!earliest || dateRange.fromDateTime < earliest) {
          earliest = dateRange.fromDateTime
        }
        if (!latest || dateRange.toDateTime > latest) {
          latest = dateRange.toDateTime
        }
      }
    }
  }
  if (!earliest) {
    earliest = DateTime.now().minus({ years: 5 })
  }
  if (!latest) {
    latest = DateTime.now().plus({ years: 5 })
  }
  if (sort !== "none") {
    const s: (arg0: Event, arg1: Event) => number = sort === 'down' ? (event1, event2) => {
      return +event1.range.fromDateTime - +event2.range.fromDateTime
    } : (event1, event2) => {
      return +event2.range.fromDateTime - +event1.range.fromDateTime
    }
    events.sort(s)
  }
  return {
    events, tags, metadata: {
      earliestTime: earliest,
      latestTime: latest,
      dateFormat
    }
  }
}