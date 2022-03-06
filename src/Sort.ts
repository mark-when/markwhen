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

  events.sort((eventOrEvents1, eventOrEvents2) => {
    if (eventOrEvents1 instanceof Event) {
      if (eventOrEvents2 instanceof Event) {
        return sortingDown ? sortDown(eventOrEvents1, eventOrEvents2) : sortUp(eventOrEvents1, eventOrEvents2)
      } else {
        if (!eventOrEvents2.range) {
          sortAndGetRange(eventOrEvents2, sort)
        }
        return sortingDown ? sortDownDateTime(eventOrEvents1.range.fromDateTime, eventOrEvents2.range!.min) : sortUpDateTime(eventOrEvents1.range.fromDateTime, eventOrEvents2.range!.min)
      }
    }

    // eventOrEvents1 is array of sub events
    if (!eventOrEvents1.range) {
      sortAndGetRange(eventOrEvents1, sort)
    }
    if (eventOrEvents2 instanceof Event) {
      return sortingDown ? sortDownDateTime(eventOrEvents1.range!.min, eventOrEvents2.range.fromDateTime) : sortUpDateTime(eventOrEvents1.range!.min, eventOrEvents2.range.fromDateTime)
    }

    if (!eventOrEvents2.range) {
      sortAndGetRange(eventOrEvents2, sort)
    }
    return sortingDown ? sortDownDateTime(eventOrEvents1.range!.min, eventOrEvents2.range!.min) : sortUpDateTime(eventOrEvents1.range!.min, eventOrEvents2.range!.min)
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

function sortAndGetRange(events: EventSubGroup, sort: Sort) {

  let min: DateTime, max: DateTime, latest: DateTime

  const sortDown = function (event1: Event, event2: Event) {
    if (!min) {
      min = event1.range.fromDateTime
    }
    if (!max) {
      max = event1.range.fromDateTime
    }
    if (!latest) {
      latest = event1.range.toDateTime
    }
    min = dateTimeMin(event1.range.fromDateTime, event2.range.fromDateTime, min)
    max = dateTimeMax(event1.range.fromDateTime, event2.range.fromDateTime, max)
    latest = dateTimeMax(event1.range.toDateTime, event2.range.toDateTime, latest)

    return +event1.range.fromDateTime - +event2.range.fromDateTime
  }
  const sortUp = function (event1: Event, event2: Event) {
    if (!min) {
      min = event1.range.fromDateTime
    }
    if (!max) {
      max = event1.range.fromDateTime
    }
    if (!latest) {
      latest = event1.range.toDateTime
    }
    min = dateTimeMin(event1.range.fromDateTime, event2.range.fromDateTime, min)
    max = dateTimeMax(event1.range.fromDateTime, event2.range.fromDateTime, max)
    latest = dateTimeMax(event1.range.toDateTime, event2.range.toDateTime, latest)

    return +event2.range.fromDateTime - +event1.range.fromDateTime
  }
  events.sort(sort === "down" ? sortDown : sortUp)
  events.range = { min: min!, max: max!, latest: latest! }
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