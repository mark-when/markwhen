import { Cascade, DateRange, Event, EventDescription, Tags } from "./Types"

const ISO8601_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}(?:\.\d*)?Z/
const NOW_REGEX = /now/
const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?/

const START_OR_END_TIME_REGEX = new RegExp(`(${ISO8601_REGEX.source})|(${NOW_REGEX.source})|(${DATE_REGEX.source})`)

const EVENT_START_REGEX = new RegExp(`^\\s*((${START_OR_END_TIME_REGEX.source})(?:-(${START_OR_END_TIME_REGEX.source}))?):(.*)`)
const COMMENT_REGEX = /^\s*\/\/.*/
const TAG_COLOR_REGEX = /^\s*#(\w*):\s*(\S+)/
const TAG_REGEX = /(?:^| )#(\w*)/g
export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
// const EVENT_START_REGEX = /^\s*(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now)(-(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now))?:/
export function parse(eventsString: string): Cascade {
  const lines = eventsString.split('\n')
  const events = [] as Event[]
  const tags = {} as Tags
  let paletteIndex = 0
  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i].trim()
    if (line.match(COMMENT_REGEX)) {
      continue
    }
    const match = line.match(TAG_COLOR_REGEX)
    if (match) {
      // console.log(match)
      tags[match[1]] = match[2]
      // parseTag(line)
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

      // Remove the date part from the first line
      eventGroup[0] = eventGroup[0].substring(eventGroup[0].indexOf(datePart) + datePart.length + 1).trim()
      const dateRange = new DateRange(datePart)
      const eventDescription = new EventDescription(eventGroup)
      const event = new Event(firstLine, dateRange, eventDescription)
      if (event) {
        events.push(event)
      }
    }
  }
  return { events, tags }
}