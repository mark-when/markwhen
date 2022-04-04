import { DateTime } from "luxon";
import sortEvents, { Sort, EventSubGroup } from "./Sort";
import {
  Cascade,
  DateRange,
  DateTimeGranularity,
  Event,
  EventDescription,
  IdedEvents,
  RelativeDate,
  Tags,
} from "./Types";

// Amounts
const MILLISECOND_AMOUNT_REGEX = /(milliseconds|ms)/i;
const SECOND_AMOUNT_REGEX = /(seconds|second|secs|sec|s)/i;
const MINUTE_AMOUNT_REGEX = /(minutes|minute|mins|min)/i;
const HOUR_AMOUNT_REGEX = /(hours|hour|h)/i;
const DAY_AMOUNT_REGEX = /(days|day|d)/i;
const WEEK_AMOUNT_REGEX = /(weeks|week|w)/i;
const MONTH_AMOUNT_REGEX = /(months|month)/i;
const YEAR_AMOUNT_REGEX = /(years|year|y)/i;
export const AMOUNT_REGEX = new RegExp(
  `(\\d+\\W*)(${MILLISECOND_AMOUNT_REGEX.source}|${SECOND_AMOUNT_REGEX.source}|${MINUTE_AMOUNT_REGEX.source}|${HOUR_AMOUNT_REGEX.source}|${DAY_AMOUNT_REGEX.source}|${WEEK_AMOUNT_REGEX.source}|${MONTH_AMOUNT_REGEX.source}|${YEAR_AMOUNT_REGEX.source})(?:\\s*,\\s*|\\s*)`,
  "g"
);

export const EVENT_ID_REGEX = /(?:^|\s)(!\w+)/;

// So this regex is kind of wrong - we're using the global flag here to make multiple matches for the
// whole regex, even though we just want any repeated amounts (e.g., 3 days, 4 hours, 6 seconds).
// This works because the entire front part (`after !eventId plus`) is optional
const RELATIVE_TIME_REGEX = new RegExp(
  `((before|after)?\\s*${EVENT_ID_REGEX.source}\\s*)?(?:plus|\\+)?\\s*(${AMOUNT_REGEX.source})+`
);

const ISO8601_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,}(?:\.\d*)?Z/;
const NOW_REGEX = /now/;
const DATE_REGEX = /\d{1,5}(\/\d{1,5}(\/\d{1,5})?)?/;

const START_OR_END_TIME_REGEX = new RegExp(
  `(${ISO8601_REGEX.source})|(${NOW_REGEX.source})|(${DATE_REGEX.source})|${RELATIVE_TIME_REGEX.source}`
);

const DATE_RANGE_REGEX = new RegExp(
  `((${START_OR_END_TIME_REGEX.source})(?:\\s*-\\s*(${START_OR_END_TIME_REGEX.source}))?):`
);
const EVENT_START_REGEX = new RegExp(`(\\s*)${DATE_RANGE_REGEX.source}(.*)`);

const COMMENT_REGEX = /^\s*\/\/.*/;
const TAG_COLOR_REGEX = /^\s*#(\w*):\s*(\S+)/;
const DATE_FORMAT_REGEX = /dateFormat:\s*d\/M\/y/;
const TAG_REGEX = /(?:^|\s)#(\w*)/g;
const GROUP_START_REGEX = /^(\s*)group/;
const GROUP_END_REGEX = /^endGroup/;

export const COLORS = [
  "green",
  "blue",
  "red",
  "yellow",
  "indigo",
  "purple",
  "pink",
];
export const sorts = ["none", "down", "up"];

const AMERICAN_DATE_FORMAT = "M/d/y";
const EUROPEAN_DATE_FORMAT = "d/M/y";

export function parse(eventsString?: string, sort: Sort = "none"): Cascade {
  if (!eventsString) {
    return {
      events: [],
      tags: {},
      ids: {},
      metadata: {
        earliestTime: DateTime.now().minus({ years: 5 }),
        latestTime: DateTime.now().plus({ years: 5 }),
        dateFormat: AMERICAN_DATE_FORMAT,
      },
    };
  }

  const lines = eventsString.split("\n");
  const events = [] as (Event | EventSubGroup)[];
  const tags = {} as Tags;
  const ids = {} as IdedEvents;

  let paletteIndex = 0;
  let dateFormat = AMERICAN_DATE_FORMAT;
  let earliest: DateTime | null = null,
    latest: DateTime | null = null;

  // For events that are grouped
  let eventSubgroup: EventSubGroup | undefined = undefined;

  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i];
    if (line.match(COMMENT_REGEX)) {
      continue;
    }
    const tagColorMatch = line.match(TAG_COLOR_REGEX);
    if (tagColorMatch) {
      tags[tagColorMatch[1]] = tagColorMatch[2];
      continue;
    }
    if (line.match(DATE_FORMAT_REGEX)) {
      dateFormat = EUROPEAN_DATE_FORMAT;
      continue;
    }
    const matches = line.matchAll(TAG_REGEX);
    if (matches) {
      for (let m of matches) {
        if (!tags[m[1]]) {
          tags[m[1]] = COLORS[paletteIndex++ % COLORS.length];
        }
      }
    }

    const groupStart = line.match(GROUP_START_REGEX);
    if (groupStart) {
      // We're starting a new group here. If there was a previous group, end it and
      // push it.
      if (eventSubgroup) {
        events.push(eventSubgroup);
      }
      eventSubgroup = parseGroupFromStartTag(line, groupStart);
      continue;
    }

    if (eventSubgroup && line.match(GROUP_END_REGEX)) {
      // We are ending our subgroup
      events.push(eventSubgroup);
      eventSubgroup = undefined;
      continue;
    }

    const eventStartLineRegexMatch = line.match(EVENT_START_REGEX);
    if (eventStartLineRegexMatch) {
      let end = i;
      let nextLine;
      do {
        nextLine = lines[++end];
      } while (
        typeof nextLine === "string" &&
        !nextLine.match(EVENT_START_REGEX) &&
        !nextLine.match(GROUP_START_REGEX) &&
        !(eventSubgroup && nextLine.match(GROUP_END_REGEX))
      );

      const eventGroup = lines
        .slice(i, end)
        .filter((l) => l && !l.match(COMMENT_REGEX));

      // Initial date range and first line description
      const firstLine = eventGroup[0];

      // What the regex matched as the date range part
      const datePart = eventStartLineRegexMatch[2];
      const eventStartDate = eventStartLineRegexMatch[3];
      const eventEndDate = eventStartLineRegexMatch[23];

      const relativeFromDate =
        eventStartLineRegexMatch[12] || eventStartLineRegexMatch[9];
      const relativeToDate =
        eventStartLineRegexMatch[32] || eventStartLineRegexMatch[29];

      let fromDateTime: DateTime;
      let endDateTime: DateTime | undefined;
      let granularity: DateTimeGranularity;
      if (relativeFromDate) {
        const relativeToEventId = eventStartLineRegexMatch[11];
        let relativeTo =
          relativeToEventId && ids[relativeToEventId]?.range.toDateTime;
        if (!relativeTo && events.length) {
          // We do not have an event to refer to by id, try to get the previous event
          const previous = events[events.length - 1];
          if (previous instanceof Event) {
            relativeTo = previous.range.toDateTime;
          } else {
            relativeTo = previous[previous.length - 1].range.toDateTime;
          }
        } else if (!relativeTo && eventSubgroup && eventSubgroup.length) {
          relativeTo = eventSubgroup[eventSubgroup.length - 1].range.toDateTime;
        }
        relativeTo = relativeTo ? relativeTo : DateTime.now();

        if (!relativeToDate && !eventEndDate) {
          // We don't have an end date set. Instead of using the relative
          // from date to determine the start time, we're going to use
          // the end time of the previous event as the start and make the
          // duration the provided relative time.
          fromDateTime = relativeTo;
          endDateTime = RelativeDate.from(eventStartDate, relativeTo);
        } else {
          fromDateTime = RelativeDate.from(eventStartDate, relativeTo);
        }
        granularity = "instant";
      } else {
        const fromString = DateRange.stringToDateTime(
          eventStartDate,
          dateFormat
        );
        fromDateTime = fromString.dateTime;
        granularity = fromString.granularity;
      }

      if (!endDateTime) {
        if (relativeToDate) {
          const relativeToEventId = eventStartLineRegexMatch[31];
          let relativeTo =
            relativeToEventId && ids[relativeToEventId]?.range.toDateTime;
          if (!relativeTo) {
            // We do not have an event to refer to by id, use the start of this event
            relativeTo = fromDateTime;
          }
          endDateTime = RelativeDate.from(eventEndDate, relativeTo);
        } else if (eventEndDate) {
          endDateTime = DateRange.roundDateUp(
            DateRange.stringToDateTime(eventEndDate, dateFormat)
          );
        } else {
          endDateTime = DateRange.roundDateUp({
            dateTime: fromDateTime,
            granularity,
          });
        }
      }

      const dateRange = new DateRange(fromDateTime, endDateTime, datePart);

      // Remove the date part from the first line
      eventGroup[0] = eventGroup[0]
        .substring(eventGroup[0].indexOf(datePart) + datePart.length + 1)
        .trim();

      const eventDescription = new EventDescription(eventGroup);
      const event = new Event(firstLine, dateRange, eventDescription);

      if (event) {
        if (eventSubgroup) {
          eventSubgroup.push(event);
        } else {
          events.push(event);
        }

        if (event.event.id && !ids[event.event.id]) {
          ids[event.event.id] = event;
        }

        if (!earliest || dateRange.fromDateTime < earliest) {
          earliest = dateRange.fromDateTime;
        }
        if (!latest || dateRange.toDateTime > latest) {
          latest = dateRange.toDateTime;
        }
      }
    }
  }

  if (eventSubgroup) {
    events.push(eventSubgroup);
  }

  if (!earliest) {
    earliest = DateTime.now().minus({ years: 5 });
  }
  if (!latest) {
    latest = DateTime.now().plus({ years: 5 });
  }
  sortEvents(events, sort);
  return {
    events,
    tags,
    ids,
    metadata: {
      earliestTime: earliest,
      latestTime: latest,
      dateFormat,
    },
  };
}

function parseGroupFromStartTag(
  s: string,
  regexMatch: RegExpMatchArray
): EventSubGroup {
  const group: EventSubGroup = [];
  group.tags = [];

  s = s
    .replace(GROUP_START_REGEX, (match, startToken) => {
      // Start expanded if this start tag is not indented
      group.startExpanded = !startToken.length;
      return "";
    })
    .replace(TAG_REGEX, (match, tag) => {
      if (!group.tags!.includes(tag)) {
        group.tags!.push(tag);
      }
      return "";
    });

  group.title = s.trim();
  return group;
}
