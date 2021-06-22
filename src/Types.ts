
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

export interface YearMonthDay {
  year: Year;
  month?: Month;
  day?: Day;
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
    this.from = this.toYearMonthDay(unparsedFrom);
    this.to = unparsedTo ? this.toYearMonthDay(unparsedTo) : undefined;
  }

  toYearMonthDay(str: string): YearMonthDay {
    if (str === "now") {
      str = new Date().toLocaleDateString();
    }
    let [year, day, month] = str.split("/").reverse();
    const yearNumber = parseInt(year);
    if (!day) {
      return { year: yearNumber };
    }
    if (!month) {
      return { year: yearNumber, month: parseInt(day) as Month };
    }
    return {
      year: yearNumber,
      month: parseInt(month) as Month,
      day: parseInt(day) as Day,
    };
  }

  getNextYear(): Year {
    if (this.to) {
      return this.to.year + 1;
    }
    return this.from.year + 1;
  }
}

export interface Settings {
  yearWidth: number
}

export class EventDescription {
  eventDescription: string
  tags: string[]
  linkRegex = /\[([\w\s\d\.]+)\]\((https?:\/\/[\w\d./?=#]+)\)/g;

  constructor(eventDescriptionString: string) {
    let reversed = EventDescription.reverseString(eventDescriptionString)
    const tagSet = new Set()
    this.tags = []
    let match
    let substringAt = 0
    while ((match = /(?:^(\w+)\! )/gm.exec(reversed)) !== null) {
      match.forEach((match, groupIndex) => {
        if (groupIndex === 1) {
          const reversedBack = EventDescription.reverseString(match)
          if (!tagSet.has(reversedBack)) {
            // We do it this way so we can keep the tags in order
            tagSet.add(reversedBack)
            this.tags.push(reversedBack)
          }
          substringAt = match.length + 2
        }
      })
      reversed = reversed.substring(substringAt)
    }
    this.eventDescription = EventDescription.reverseString(reversed.trim())
  }

  getInnerHtml() {
    return this.eventDescription.replace(this.linkRegex, (substring, linkText, link) => {
      return `<a class="underline" href="${link}">${linkText}</a>`;
    });
  }

  static reverseString(s: string): string {
    return s.split("").reverse().join("")
  }
}

export class Event {
  range: DateRange;
  event: EventDescription;

  constructor(range: DateRange, event: EventDescription) {
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