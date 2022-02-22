import { DateTime } from "luxon";

export type Year = number;
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 21
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

export type DateTimeGranularity = "instant" | "year" | "month" | "day"
export type GranularDateTime = {
  dateTime: DateTime
  granularity: DateTimeGranularity
}

export const DATE_TIME_FORMAT_MONTH_YEAR = 'M/y'
export const DATE_TIME_FORMAT_YEAR = 'y'

export class YearMonthDay {
  year: Year;
  month?: Month;
  day?: Day;

  constructor(str: string) {
    if (str === "now") {
      str = new Date().toLocaleDateString();
    }
    let [year, day, month] = str.split("/").reverse();
    let yearNumber = parseInt(year);

    // If we can't parse what was given to us, we're going to recast it to `now`
    if (isNaN(yearNumber)) {
      str = new Date().toLocaleDateString();
      [year, day, month] = str.split("/").reverse();
      yearNumber = parseInt(year);
    }

    this.year = yearNumber
    if (!day) {
      return
    }

    if (!month) {
      this.month = parseInt(day) as Month
      return
    }

    this.month = parseInt(month) as Month
    this.day = parseInt(day) as Day
  }
}

export interface BoundingYears {
  start: Year;
  end: Year;
}

export class DateRange {
  fromDateTime: DateTime
  toDateTime: DateTime
  from: YearMonthDay;
  to?: YearMonthDay;
  originalString: string

  constructor(from: string, to: string, originalString: string, dateFormat: string) {
    this.from = new YearMonthDay(from);
    this.to = to ? new YearMonthDay(to) : undefined;
    this.originalString = originalString

    const { dateTime: fromDateTime, granularity } = DateRange.stringToDateTime(from, dateFormat)
    this.fromDateTime = fromDateTime
    if (to) {
      this.toDateTime = DateRange.roundDateUp(DateRange.stringToDateTime(to, dateFormat))
    } else {
      this.toDateTime = DateRange.roundDateUp({ dateTime: this.fromDateTime, granularity })
    }
  }

  getNextYear(): Year {
    if (this.to) {
      return this.to.year + 1;
    }
    return this.from.year + 1;
  }

  startingDay(): YearMonthDay {
    return {
      year: this.from.year,
      month: this.from.month ? this.from.month : 1,
      day: this.from.day ? this.from.day : 1
    }
  }

  endingDay(): YearMonthDay {
    if (this.to) {
      return {
        year: this.to.year,
        month: this.to.month ? this.to.month : 12,
        day: this.to.day ? Math.min(this.to.day, 30) as Day : 30
      }
    } else {
      return {
        year: this.from.year,
        month: this.from.month ? this.from.month : 12,
        day: this.from.day ? Math.min(this.from.day, 30) as Day : 30
      }
    }
  }

  static stringToDateTime(s: string, fullFormat: string): GranularDateTime {
    let dateTime = DateTime.fromFormat(s, fullFormat)
    if (dateTime.isValid) {
      return { dateTime, granularity: 'day' }
    }
    dateTime = DateTime.fromFormat(s, DATE_TIME_FORMAT_MONTH_YEAR)
    if (dateTime.isValid) {
      return { dateTime, granularity: 'month' }
    }
    dateTime = DateTime.fromFormat(s, DATE_TIME_FORMAT_YEAR)
    if (dateTime.isValid) {
      return { dateTime, granularity: 'year' }
    }
    dateTime = DateTime.fromISO(s)
    if (dateTime.isValid) {
      return { dateTime, granularity: 'instant' }
    }
    return { dateTime: DateTime.now(), granularity: 'instant' }
  }

  static roundDateUp(granularDateTime: GranularDateTime): DateTime {
    if (granularDateTime.granularity === 'instant') {
      return granularDateTime.dateTime
    }
    return granularDateTime.dateTime.plus({ [granularDateTime.granularity]: 1 })
  }
}

export interface Settings {
  scale: number
}

export const LINK_REGEX = /\[([^\]]+)\]\(((https?:\/\/)?[\w\d./?=\-#]+)\)/g;
export const LOCATION_REGEX = /\[([^\]]+)\]\((location|map)\)/g;
export const GOOGLE_PHOTOS_REGEX = /(?:https:\/\/)?photos.app.goo.gl\/\w+/g
export const AT_REGEX = /@([\w\d\/]+)/g
export const TAG_REGEX = /(?: |^)#(\w+)/g

export class EventDescription {
  eventDescription: string
  tags: string[] = []
  supplemental: string[]
  googlePhotosLink?: string
  locations: string[] = []

  constructor(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      line = line.replace(GOOGLE_PHOTOS_REGEX, (match) => {
        if (!this.googlePhotosLink) {
          this.googlePhotosLink = match
        }
        return ''
      })
      line = line.replace(LOCATION_REGEX, (match, locationString) => {
        this.locations.push(locationString)
        return ''
      })
      line = line.replace(TAG_REGEX, (match, tag) => {
        if (!this.tags.includes(tag)) {
          this.tags.push(tag)
        }
        return ''
      })
      lines[i] = line
    }
    this.eventDescription = lines[0]
    this.supplemental = lines.slice(1).filter(l => !!l.trim())
  }

  getInnerHtml() {
    return EventDescription.toInnerHtml(this.eventDescription)
  }

  static toInnerHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(LINK_REGEX, (substring, linkText, link) => {
        return `<a class="underline" href="${EventDescription.addHttpIfNeeded(link)}">${linkText}</a>`;
      }).replace(AT_REGEX, (substring, at) => {
        return `<a class="underline" href="/${at}">@${at}</a>`
      })
  }

  static addHttpIfNeeded(s: string): string {
    if (s.startsWith('http://') || s.startsWith('https://')) {
      return s
    }
    return `http://${s}`
  }

  static reverseString(s: string): string {
    return s.split("").reverse().join("")
  }
}

export class Event {
  eventString: string
  range: DateRange;
  event: EventDescription;

  constructor(eventString: string, range: DateRange, event: EventDescription) {
    this.eventString = eventString
    this.range = range;
    this.event = event;
  }

  startingYear(): Year {
    return this.range.from.year;
  }

  getNextYear(): Year {
    return this.range.getNextYear();
  }

  getInnerHtml(): string {
    return this.event.getInnerHtml()
  }

  getDateHtml(): string {
    return this.range.originalString
  }
}

export type Tags = { [tagName: string]: string }

export interface Cascade {
  events: Event[]
  tags: Tags
  metadata: CascadeMetadata
}

export interface CascadeMetadata {
  earliestTime: DateTime
  latestTime: DateTime
  dateFormat: string
}