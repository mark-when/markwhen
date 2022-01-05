import { Cascade, Event, Tags } from "./Types"

const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now/
const EVENT_START_REGEX = new RegExp(`^\\s*(${DATE_REGEX.source})(-(${DATE_REGEX.source}))?:.*`)
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
    if (line.match(EVENT_START_REGEX)) {
      let end = i
      let nextLine
      do {
        nextLine = lines[++end]
      } while (typeof nextLine === 'string' && !nextLine.match(EVENT_START_REGEX))
      const eventGroup = lines.slice(i, end).filter(l => l && !l.match(COMMENT_REGEX))
      const event = Event.fromLineGroup(eventGroup)
      if (event) {
        events.push(event)
      }
    }
  }
  return { events, tags }
}