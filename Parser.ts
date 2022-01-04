import { Event } from "./Types"

const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now/
const EVENT_START_REGEX = new RegExp(`^\\s*(${DATE_REGEX.source})(-(${DATE_REGEX.source}))?:.*`)
const COMMENT_REGEX = /^\s*\/\/.*/
const TAG_COLOR_REGEX = /^#\w*:/
// const EVENT_START_REGEX = /^\s*(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now)(-(\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?|now))?:/

export function parse(eventsString: string): Event[] {
  const lines = eventsString.split('\n')
  const events = [] as Event[]
  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i].trim()
    if (line.match(COMMENT_REGEX)) {
      continue
    }
    if (line.match(TAG_COLOR_REGEX)) {
      // parseTag(line)
      continue
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
  return events
}