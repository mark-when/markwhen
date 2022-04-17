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
  Range,
} from "./Types";
// import * as chronoNode from 'chrono-node';

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

// const chrono = chronoNode.casual.clone()
// chrono.parsers.push({
//   pattern: () => { return AMOUNT_REGEX },
//   extract: (context, match) => {

//   }
// })

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

export const COMMENT_REGEX = /^\s*\/\/.*/;
const TAG_COLOR_REGEX = /^\s*#(\w*):\s*(\S+)/;
const DATE_FORMAT_REGEX = /dateFormat:\s*d\/M\/y/;
const TAG_REGEX = /(?:^|\s)#(\w*)/g;
const GROUP_START_REGEX = /^(\s*)(group|section)(?:\s|$)/;
const GROUP_END_REGEX = /^end(?:Group|Section)/;

// RGB, so we can use rgba(... ) with a different alpha where we need it
export const COLORS = [
  "22, 163, 76",
  "2, 132, 199",
  "212, 50, 56",
  "242, 202, 45",
  "80, 73, 229",
  "145, 57, 234",
  "214, 45, 123",
  "234, 88, 11",
  "168, 162, 157",
  "255, 255, 255",
  "0, 0, 0",
];
export const HUMAN_COLORS = [
  "green",
  "blue",
  "red",
  "yellow",
  "indigo",
  "purple",
  "pink",
  "orange",
  "gray",
  "white",
  "black",
];
export const sorts = ["none", "down", "up"];

const AMERICAN_DATE_FORMAT = "M/d/y";
const EUROPEAN_DATE_FORMAT = "d/M/y";

export interface Foldable {
  endIndex: number;
  type: "comment" | "section";
  startLine: number;
  startIndex?: number;
  foldStartIndex?: number;
}

export function parse(eventsString?: string, sort: Sort = "none"): Cascade {
  if (!eventsString) {
    return {
      events: [],
      tags: {},
      ids: {},
      foldables: {},
      ranges: [],
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

  // For folding
  const foldables: {
    [F in number | string]: Foldable;
  } = {};

  let lengthAtIndex: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      lengthAtIndex.push(0);
    }
    lengthAtIndex.push(
      1 + lines[i].length + lengthAtIndex[lengthAtIndex.length - 1] || 0
    );
  }
  const ranges: Range[] = [];
  for (let i = 0; i < lines.length; i++) {
    // Remove comments
    const line = lines[i];
    const currentFoldableComment = foldables["comment"];
    const currentFoldableSection = foldables["section"];
    if (line.match(COMMENT_REGEX)) {
      const from = lengthAtIndex[i];
      const to = from + line.length;
      ranges.push({
        type: "comment",
        from,
        to,
      });

      if (currentFoldableComment) {
        currentFoldableComment.endIndex = to;
      } else {
        const indexOfSlashes = line.indexOf("//");
        foldables["comment"] = {
          startIndex: from,
          startLine: i,
          endIndex: to,
          type: "comment",
          foldStartIndex: from + (indexOfSlashes > -1 ? indexOfSlashes + 2 : 0),
        };
      }
      continue;
    } else {
      if (currentFoldableComment) {
        if (currentFoldableComment.startLine < i - 1) {
          // We had had a foldable comment section that we can close off, since this line
          // is not a comment.
          foldables[currentFoldableComment.startIndex!] = {
            ...currentFoldableComment,
          };
        }
        delete foldables["comment"];
      }
    }
    const tagColorMatch = line.match(TAG_COLOR_REGEX);
    if (tagColorMatch) {
      const colorDef = tagColorMatch[2];
      const humanColorIndex = HUMAN_COLORS.indexOf(colorDef);
      tags[tagColorMatch[1]] =
        humanColorIndex >= 0 ? COLORS[humanColorIndex] : colorDef;
      const indexOfTag = line.indexOf(tagColorMatch[1]);
      const from = lengthAtIndex[i] + indexOfTag - 1;
      ranges.push({
        type: "tag",
        from,
        to: from + tagColorMatch[1].length + 1,
        content: { tag: tagColorMatch[1], color: tags[tagColorMatch[1]] },
      });
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
        const from = lengthAtIndex[i] + line.indexOf("#" + m[1]);
        ranges.push({
          type: "tag",
          from,
          to: from + m[1].length + 1,
          content: { tag: m[1], color: tags[m[1]] },
        });
      }
    }

    const groupStart = line.match(GROUP_START_REGEX);
    if (groupStart) {
      // We're starting a new group here. If there was a previous group, end it and
      // push it.
      if (eventSubgroup) {
        events.push(eventSubgroup);
      }

      // Tie up previous foldable
      if (currentFoldableSection) {
        if (currentFoldableSection.startLine < i - 1) {
          foldables[currentFoldableSection.startIndex!] = {
            type: "section",
            startIndex: currentFoldableSection.startIndex!,
            endIndex: lengthAtIndex[i] - 1,
            startLine: currentFoldableSection.startLine,
            foldStartIndex: currentFoldableSection.foldStartIndex,
          };
        }
        delete foldables["section"];
      }

      ranges.push({
        from: lengthAtIndex[i],
        to: lengthAtIndex[i] + groupStart[0].length,
        type: "section",
      });
      eventSubgroup = parseGroupFromStartTag(line, groupStart);

      // Make new foldable
      foldables["section"] = {
        type: "section",
        startLine: i,
        startIndex: lengthAtIndex[i],
        endIndex: lengthAtIndex[i] + line.length,
        foldStartIndex: lengthAtIndex[i] + line.length,
      };

      continue;
    }

    if (eventSubgroup && line.match(GROUP_END_REGEX)) {
      // We are ending our subgroup
      events.push(eventSubgroup);
      eventSubgroup = undefined;
      ranges.push({
        from: lengthAtIndex[i],
        to: lengthAtIndex[i] + line.length,
        type: "section",
      });

      // Tie up foldable
      if (currentFoldableSection) {
        if (currentFoldableSection.startLine < i - 1) {
          foldables[currentFoldableSection.startIndex!] = {
            type: "section",
            startIndex: currentFoldableSection.startIndex,
            endIndex: lengthAtIndex[i] + line.length,
            startLine: currentFoldableSection.startLine,
            foldStartIndex: currentFoldableSection.foldStartIndex,
          };
        }
        delete foldables["section"];
      }

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

      const eventGroup = lines.slice(i, end);

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

      const indexOfDateRange = eventGroup[0].indexOf(datePart);
      const dateRangeInText = {
        type: "dateRange",
        from: lengthAtIndex[i] + indexOfDateRange,
        to: lengthAtIndex[i] + indexOfDateRange + datePart.length + 1,
      };
      ranges.push(dateRangeInText);
      // Remove the date part from the first line
      eventGroup[0] = eventGroup[0]
        .substring(indexOfDateRange + datePart.length + 1)
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
    ranges,
    foldables,
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
  group.style = "group";

  s = s
    .replace(GROUP_START_REGEX, (match, startToken, groupOrSection) => {
      // Start expanded if this start tag is not indented
      group.startExpanded = !startToken.length;
      group.style = groupOrSection as "group" | "section";
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
