import { DateTime } from "luxon";
import {
  AMERICAN_DATE_FORMAT,
  AMOUNT_REGEX,
  COMMENT_REGEX,
  EVENT_ID_REGEX,
} from "./Parser";

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

export type DateTimeGranularity = "instant" | "year" | "month" | "day";
export type GranularDateTime = {
  dateTime: DateTime;
  granularity: DateTimeGranularity;
};

export const DATE_TIME_FORMAT_MONTH_YEAR = "M/y";
export const DATE_TIME_FORMAT_YEAR = "y";

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

    this.year = yearNumber;
    if (!day) {
      return;
    }

    if (!month) {
      this.month = parseInt(day) as Month;
      return;
    }

    this.month = parseInt(month) as Month;
    this.day = parseInt(day) as Day;
  }
}

export interface BoundingYears {
  start: Year;
  end: Year;
}

export class RelativeDate {
  static from(raw: string, priorDate: DateTime = DateTime.now()): DateTime {
    const matches = raw.matchAll(AMOUNT_REGEX);
    let match = matches.next();
    while (match.value) {
      const value = match.value as RegExpMatchArray;
      const amount = parseInt(value[1]);
      if (value[3]) {
        priorDate = priorDate.plus({ milliseconds: amount });
      } else if (value[4]) {
        priorDate = priorDate.plus({ seconds: amount });
      } else if (value[5]) {
        priorDate = priorDate.plus({ minutes: amount });
      } else if (value[6]) {
        priorDate = priorDate.plus({ hours: amount });
      } else if (value[7]) {
        priorDate = priorDate.plus({ days: amount });
      } else if (value[8]) {
        priorDate = priorDate.plus({ weeks: amount });
      } else if (value[9]) {
        priorDate = priorDate.plus({ months: amount });
      } else if (value[10]) {
        priorDate = priorDate.plus({ years: amount });
      }
      match = matches.next();
    }
    return priorDate;
  }
}

export interface DateRange {
  fromDateTime: DateTime;
  toDateTime: DateTime;
}

export class DateRangePart implements DateRange {
  fromDateTime: DateTime;
  toDateTime: DateTime;
  originalString?: string;
  dateRangeInText: Range;

  constructor(
    fromDateTime: DateTime,
    toDateTime: DateTime,
    originalString: string,
    dateRangeInText: Range
  ) {
    this.fromDateTime = fromDateTime;
    this.toDateTime = toDateTime;
    this.originalString = originalString;
    this.dateRangeInText = dateRangeInText;
  }

  static stringToDateTime(s: string, fullFormat: string): GranularDateTime {
    let dateTime = DateTime.fromFormat(s, fullFormat);
    if (dateTime.isValid) {
      return { dateTime, granularity: "day" };
    }
    dateTime = DateTime.fromFormat(s, DATE_TIME_FORMAT_MONTH_YEAR);
    if (dateTime.isValid) {
      return { dateTime, granularity: "month" };
    }
    dateTime = DateTime.fromFormat(s, DATE_TIME_FORMAT_YEAR);
    if (dateTime.isValid) {
      return { dateTime, granularity: "year" };
    }
    dateTime = DateTime.fromISO(s);
    if (dateTime.isValid) {
      return { dateTime, granularity: "instant" };
    }
    return { dateTime: DateTime.now(), granularity: "instant" };
  }

  static roundDateUp(granularDateTime: GranularDateTime): DateTime {
    if (granularDateTime.granularity === "instant") {
      return granularDateTime.dateTime;
    }
    return granularDateTime.dateTime.plus({
      [granularDateTime.granularity]: 1,
    });
  }
}

export const LINK_REGEX = /\[([^\]]+)\]\(((https?:\/\/)?[\w\d./?=\-#]+)\)/g;
export const LOCATION_REGEX = /\[([^\]]+)\]\((location|map)\)/g;
export const GOOGLE_PHOTOS_REGEX = /(?:https:\/\/)?photos.app.goo.gl\/\w+/g;
export const AT_REGEX = /@([\w\d\/]+)/g;
export const TAG_REGEX = /(?: |^)#(\w+)/g;
const PERCENT_REGEX = /(?:\s|^)(\d{1,3})%(?:\s|$)/;

export class EventDescription {
  eventDescription: string;
  tags: string[] = [];
  supplemental: string[];
  googlePhotosLink?: string;
  locations: string[] = [];
  id?: string;
  percent?: number;

  constructor(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.replace(GOOGLE_PHOTOS_REGEX, (match) => {
        if (!this.googlePhotosLink) {
          this.googlePhotosLink = match;
        }
        return "";
      });
      line = line.replace(LOCATION_REGEX, (match, locationString) => {
        this.locations.push(locationString);
        return "";
      });
      line = line.replace(TAG_REGEX, (match, tag) => {
        if (!this.tags.includes(tag)) {
          this.tags.push(tag);
        }
        return "";
      });
      line = line.replace(EVENT_ID_REGEX, (match, id) => {
        if (!this.id) {
          this.id = id;
          return "";
        }
        return id;
      });
      if (!this.percent) {
        const percent = line.match(PERCENT_REGEX);
        if (percent) {
          this.percent = parseInt(percent[0]);
        }
      }
      lines[i] = line;
    }
    this.eventDescription = lines[0];
    this.supplemental = lines
      .slice(1)
      .filter((l) => !l.match(COMMENT_REGEX) && !!l.trim());
  }

  getInnerHtml() {
    return EventDescription.toInnerHtml(this.eventDescription);
  }

  static toInnerHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(LINK_REGEX, (substring, linkText, link) => {
        return `<a class="underline text-black dark:text-white" href="${EventDescription.addHttpIfNeeded(
          link
        )}">${linkText}</a>`;
      })
      .replace(AT_REGEX, (substring, at) => {
        return `<a class="underline text-black dark:text-white" href="/${at}">@${at}</a>`;
      });
  }

  static addHttpIfNeeded(s: string): string {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return s;
    }
    return `http://${s}`;
  }

  static reverseString(s: string): string {
    return s
      .split("")
      .reverse()
      .join("");
  }
}

export type Range = {
  from: number;
  to: number;
  type: string;
  content?: any;
};

export type EventRanges = { event: Range; date: DateRangePart };

export class Event {
  eventString: string;
  ranges: EventRanges;
  event: EventDescription;

  constructor(
    eventString: string,
    ranges: EventRanges,
    event: EventDescription
  ) {
    this.eventString = eventString;
    this.ranges = ranges;
    this.event = event;
  }

  getInnerHtml(): string {
    return this.event.getInnerHtml();
  }

  getDateHtml(): string {
    return this.ranges.date.originalString || "";
  }
}

export type Tags = { [tagName: string]: string };
export type IdedEvents = { [id: string]: Event };
export interface Cascade {
  ranges: Range[];
  foldables: {};
  events: Events;
  tags: Tags;
  ids: IdedEvents;
  metadata: CascadeMetadata;
}

export function emptyCascade(): Cascade {
  return {
    events: [],
    ranges: [],
    foldables: [],
    tags: {},
    ids: {},
    metadata: {
      earliestTime: DateTime.now().minus({ years: 5 }),
      latestTime: DateTime.now().plus({ years: 5 }),
      dateFormat: AMERICAN_DATE_FORMAT,
      startLineIndex: 0,
      endLineIndex: 0,
      startStringIndex: 0,
      endStringIndex: 0,
    },
  };
}

export interface Cascades {
  cascades: Cascade[];
}

export type Events = (Event | Event[])[];

export interface CascadeMetadata {
  earliestTime: DateTime;
  latestTime: DateTime;
  dateFormat: string;
  startLineIndex: number;
  startStringIndex: number;
  endLineIndex: number;
  endStringIndex: number;
  title?: string;
  description?: string;
}

export type GroupStyle = "section" | "tight";
