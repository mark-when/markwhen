
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
  from: YearMonthDay;
  to?: YearMonthDay;
  originalString: string

  constructor(dateString: string) {
    this.originalString = dateString
    const commentIndex = dateString.indexOf("//");
    if (commentIndex >= 0) {
      dateString = dateString.substring(0, commentIndex);
    }
    const [unparsedFrom, unparsedTo] = dateString.split("-");
    this.from = new YearMonthDay(unparsedFrom);
    this.to = unparsedTo ? new YearMonthDay(unparsedTo) : undefined;
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

  numDays(): number {
    return DateRange.numDaysBetween(this.startingDay(), this.endingDay())
  }

  static numDaysBetween(startingDay: YearMonthDay, endingDay: YearMonthDay): number {
    let days: number
    if (startingDay.year === endingDay.year) {
      days = ((endingDay.month! - startingDay.month!) * 30) + (endingDay.day! - startingDay.day!) + 1
    } else {
      const restOfTheYear = DateRange.numDaysBetween(startingDay, { year: startingDay.year, month: 12, day: 30 })
      const beginningOfTheYear = DateRange.numDaysBetween({ year: endingDay.year, month: 1, day: 1 }, endingDay)
      days = restOfTheYear + ((endingDay.year - startingDay.year - 1) * 360) + beginningOfTheYear
    }
    return days
  }
}

export interface Settings {
  yearWidth: number
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
        console.log(substring, linkText, link)
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

export interface Settings {
  yearWidth: number
}

export type Tags = { [tagName: string]: string }

export interface Cascade {
  events: Event[]
  tags: Tags
}