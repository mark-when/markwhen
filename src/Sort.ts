import { DateTime } from "luxon"
import { Event } from "./Types"

export type Sort = "none" | "down" | "up"
export interface EventSubGroup extends Array<Event> {
  tags?: string[]
  title?: string
  range?: { min: DateTime, max: DateTime, latest: DateTime }
  method?: "explicit" | "indentation"
  startExpanded?: boolean
}

export default function sortEvents(events: (Event | EventSubGroup)[], sort: Sort) {
  if (sort === 'none') {
    return events.map(eventOrEventGroup => {
      if (eventOrEventGroup instanceof Event) {
        return eventOrEventGroup
      }
      addRangeToEventGroup(eventOrEventGroup)
      return eventOrEventGroup
    })
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

  // We need this because sort won't be called if there's only one element in the array
  if (events.length === 1 && Array.isArray(events[0])) {
    sortGroup(events[0], sort)
    addRangeToEventGroup(events[0])
  }

  events.sort((eventOrEvents1, eventOrEvents2) => {
    const now = DateTime.now()
    if (eventOrEvents1 instanceof Event) {
      if (eventOrEvents2 instanceof Event) {
        return sortingDown ? sortDown(eventOrEvents1, eventOrEvents2) : sortUp(eventOrEvents1, eventOrEvents2)
      } else {
        if (!eventOrEvents2.range) {
          sortGroup(eventOrEvents2, sort)
          addRangeToEventGroup(eventOrEvents2)
        }
        return sortingDown ? sortDownDateTime(eventOrEvents1.range.fromDateTime, eventOrEvents2.range?.min ?? now) : sortUpDateTime(eventOrEvents1.range.fromDateTime, eventOrEvents2.range?.min ?? now)
      }
    }

    // eventOrEvents1 is array of sub events
    if (!eventOrEvents1.range) {
      sortGroup(eventOrEvents1, sort)
      addRangeToEventGroup(eventOrEvents1)
    }
    if (eventOrEvents2 instanceof Event) {
      return sortingDown ? sortDownDateTime(eventOrEvents1.range?.min ?? now, eventOrEvents2.range.fromDateTime) : sortUpDateTime(eventOrEvents1.range?.min ?? now, eventOrEvents2.range.fromDateTime)
    }

    if (!eventOrEvents2.range) {
      sortGroup(eventOrEvents2, sort)
      addRangeToEventGroup(eventOrEvents2)
    }
    return sortingDown ? sortDownDateTime(eventOrEvents1.range?.min ?? now, eventOrEvents2.range?.min ?? now) : sortUpDateTime(eventOrEvents1.range?.min ?? now, eventOrEvents2.range?.min ?? now)
  })
}

function addRangeToEventGroup(events: EventSubGroup) {
  if (!events || !events.length) {
    return
  }
  let min: DateTime = events[0].range.fromDateTime, max: DateTime = events[0].range.fromDateTime, latest = events[0].range.toDateTime
  for (const e of events) {
    min = e.range.fromDateTime < min ? e.range.fromDateTime : min
    max = e.range.fromDateTime > max ? e.range.fromDateTime : max
    latest = e.range.toDateTime > latest ? e.range.toDateTime : latest
  }
  events.range = { min, max, latest }
}

function sortGroup(events: EventSubGroup, sort: Sort) {
  const sortDown = function (event1: Event, event2: Event) {
    return +event1.range.fromDateTime - +event2.range.fromDateTime
  }
  const sortUp = function (event1: Event, event2: Event) {
    return +event2.range.fromDateTime - +event1.range.fromDateTime
  }
  events.sort(sort === "down" ? sortDown : sortUp)
}