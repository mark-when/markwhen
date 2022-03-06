import { DateTime } from "luxon"
import sortEvents, { Sort, EventSubGroup } from "./Sort"
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
const GROUP_START_REGEX = /^(\s*)startGroup/
const GROUP_END_REGEX = /^endGroup/

export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
export const sorts = ["none", "down", "up"]

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
  const events = [] as (Event | EventSubGroup)[]
  const tags = {} as Tags
  let paletteIndex = 0
  let dateFormat = AMERICAN_DATE_FORMAT
  let earliest: DateTime | null = null, latest: DateTime | null = null

  // For events that are indented and/or grouped
  let eventSubgroup: EventSubGroup | undefined = undefined

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

    const groupStart = line.match(GROUP_START_REGEX)
    if (groupStart) {
      // We're starting a new group here. If there was a previous group, end it and
      // push it.
      if (eventSubgroup) {
        events.push(eventSubgroup)
      }
      eventSubgroup = parseGroupFromStartTag(line)
      continue
    }

    if (eventSubgroup && line.match(GROUP_END_REGEX)) {
      // We are ending our subgroup
      events.push(eventSubgroup)
      eventSubgroup = undefined
      continue
    }

    const eventStart = line.match(EVENT_START_REGEX)
    if (eventStart) {
      let end = i
      let nextLine
      do {
        nextLine = lines[++end]
      } while (
        typeof nextLine === 'string'
        && !nextLine.match(EVENT_START_REGEX)
        && !nextLine.match(GROUP_START_REGEX)
        && !(eventSubgroup && nextLine.match(GROUP_END_REGEX))
      )

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
          if (eventSubgroup) {
            eventSubgroup.push(event)
          } else {
            eventSubgroup = [event]
            eventSubgroup!.method = 'indentation'
          }
        } else {
          // We're not indented but there was a subgroup ongoing
          // If we were explicit about our group, we should add
          // to it until we see `endGroup`. Otherwise, 
          // if we were going by indentation, we can finish off the last 
          // group.
          if (eventSubgroup) {
            if (eventSubgroup.method) {
              if (eventSubgroup.method === 'indentation') {
                // Finish it off.
                events.push(eventSubgroup)
                eventSubgroup = undefined

                // And add the event we're currently on
                events.push(event)
              } else {
                // Since we were explicit, we add until we see the end tag.
                eventSubgroup.push(event)
              }
            }
          } else {
            events.push(event)
          }
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

  if (eventSubgroup) {
    events.push(eventSubgroup)
  }

  if (!earliest) {
    earliest = DateTime.now().minus({ years: 5 })
  }
  if (!latest) {
    latest = DateTime.now().plus({ years: 5 })
  }
  sortEvents(events, sort)
  return {
    events, tags, metadata: {
      earliestTime: earliest,
      latestTime: latest,
      dateFormat
    }
  }
}

function parseGroupFromStartTag(s: string): EventSubGroup {
  const group: EventSubGroup = []
  group.tags = []

  s = s
    .replace(GROUP_START_REGEX, (match, startToken) => {
      // Start expanded if this start tag is not indented
      group.startExpanded = !startToken.length
      return ''
    })
    .replace(TAG_REGEX, (match, tag) => {
      if (!group.tags!.includes(tag)) {
        group.tags!.push(tag)
      }
      return ''
    })

  group.title = s.trim()
  group.method = 'explicit'
  return group
}