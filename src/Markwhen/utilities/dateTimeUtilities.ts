import { DateTime, type DurationUnits } from "luxon";
import {
  AMERICAN_DATE_FORMAT,
  DateRangePart,
  EUROPEAN_DATE_FORMAT,
  Event,
  toDateRange,
  type DateFormat,
  type DateRange,
} from "@markwhen/parser/lib/Types";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { isEventNode, eventValue } from "@markwhen/parser/lib/Noder";

export enum Weight {
  SECOND = 0,
  QUARTER_MINUTE = 1,
  MINUTE = 2,
  QUARTER_HOUR = 3,
  HOUR = 4,
  DAY = 5,
  MONTH = 6,
  YEAR = 7,
  DECADE = 8,
  CENT = 9,
}

export type DisplayScale =
  | "second"
  | "quarterminute"
  | "minute"
  | "quarterhour"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "decade"
  | "cent";

export const scales: DisplayScale[] = [
  "second",
  "quarterminute",
  "minute",
  "quarterhour",
  "hour",
  "day",
  "month",
  "year",
  "decade",
  "cent",
];

export function dateScale(dateTime: DateTime) {
  if (dateTime.second === 0) {
    if (dateTime.minute === 0) {
      if (dateTime.hour === 0) {
        if (dateTime.day === 1) {
          if (dateTime.month === 1) {
            if (dateTime.year % 100 === 0) {
              return Weight.CENT;
            }
            if (dateTime.year % 10 === 0) {
              return Weight.DECADE;
            }
            return Weight.YEAR;
          }
          return Weight.MONTH;
        }
        return Weight.DAY;
      }
      return Weight.HOUR;
    } else if (dateTime.minute % 15 == 0) {
      return Weight.QUARTER_HOUR;
    }
    return Weight.MINUTE;
  } else if (dateTime.second % 15 === 0) {
    return Weight.QUARTER_MINUTE;
  }
  return Weight.SECOND;
}

export const viewportLeftMarginPixels = 64;
export const diffScale = "hours";

export interface DateInterval {
  from: DateTime;
  to: DateTime;
}

export function floorDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const year = dateTime.year;
  if (toScale === "cent") {
    const roundedYear = year - (year % 100);
    return DateTime.fromObject({ year: roundedYear });
  }
  if (toScale === "decade") {
    const roundedYear = year - (year % 10);
    return DateTime.fromObject({ year: roundedYear });
  }
  if (toScale === "year") {
    return DateTime.fromObject({ year });
  }
  const month = dateTime.month;
  if (toScale === "month") {
    return DateTime.fromObject({ year, month });
  }
  const day = dateTime.day;
  if (toScale === "day") {
    return DateTime.fromObject({ year, month, day });
  }
  const hour = dateTime.hour;
  if (toScale === "hour") {
    return DateTime.fromObject({ year, month, day, hour });
  }
  const minute = dateTime.minute;
  if (toScale === "quarterhour") {
    return DateTime.fromObject({
      year,
      month,
      day,
      hour,
      minute: minute - (minute % 15),
    });
  }
  const second = dateTime.second;
  if (toScale === "quarterminute") {
    return DateTime.fromObject({
      year,
      month,
      day,
      hour,
      minute,
      second: second - (second % 15),
    });
  }
  if (toScale === "minute") {
    return DateTime.fromObject({ year, month, day, hour, minute });
  }
  return DateTime.fromObject({ year, month, day, hour, minute, second });
}

export function ceilDateTime(dateTime: DateTime, toScale: DisplayScale) {
  let increment;
  if (toScale === "cent") {
    increment = { years: 100 };
  } else if (toScale === "decade") {
    increment = { years: 10 };
  } else if (toScale === "quarterhour") {
    increment = { minutes: 15 };
  } else if (toScale === "quarterminute") {
    increment = { seconds: 15 };
  } else {
    increment = { [toScale]: 1 };
  }
  const ceiled = floorDateTime(dateTime, toScale).plus(increment);
  return ceiled;
}

export function roundDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const up = ceilDateTime(dateTime, toScale);
  const down = floorDateTime(dateTime, toScale);
  const upDiff = dateTime.diff(up);
  const downDiff = dateTime.diff(down);
  return Math.abs(+upDiff) < Math.abs(+downDiff) ? up : down;
}

export interface DateTimeAndOffset {
  dateTime: DateTime;
  left: number;
}

export type OffsetRange = [DateTimeAndOffset, DateTimeAndOffset];

export const humanDuration = (range: DateRange): string => {
  const units: DurationUnits = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];
  const diff = range.toDateTime.diff(range.fromDateTime, units);
  let adjustedUnits = units.filter((u) => diff.get(u) > 0);
  return adjustedUnits.length
    ? range.toDateTime.diff(range.fromDateTime, adjustedUnits).toHuman()
    : "instant";
};

export const eventHumanDuration = (e: Event): string =>
  humanDuration(toDateRange(e.dateRangeIso));

export const scaleForDuration = (dateRange: DateRangePart): DisplayScale => {
  const diff = dateRange.toDateTime.diff(dateRange.fromDateTime).as("seconds");
  if (diff < 60) {
    return "second";
  }
  if (diff < 60 * 60) {
    return "minute";
  }
  if (diff < 60 * 60 * 24) {
    return "hour";
  }
  if (diff < 60 * 60 * 24 * 30) {
    return "day";
  }
  if (diff < 60 * 60 * 24 * 30 * 12) {
    return "month";
  }
  return "year";
};

function isAtLeastDaySpecificDate(
  dateTime: DateTime,
  scale: DisplayScale
): boolean {
  return (
    isDayStartOrEnd(dateTime, scale) ||
    isMonthStartOrEnd(dateTime, scale) ||
    isYearStartOrEnd(dateTime, scale)
  );
}

function isAtLeastDaySpecificRange(
  range: DateRange,
  scale: DisplayScale
): boolean {
  return (
    isAtLeastDaySpecificDate(range.fromDateTime, scale) &&
    isAtLeastDaySpecificDate(range.toDateTime, scale)
  );
}

export function dateRangeToString(
  range: DateRange,
  scale: DisplayScale,
  dateFormat: DateFormat | undefined
) {
  if (isAtLeastDaySpecificRange(range, scale)) {
    const fromAsString = dateTimeToString(
      range.fromDateTime,
      scale,
      true,
      dateFormat
    );
    const toAsString = dateTimeToString(
      range.toDateTime,
      scale,
      false,
      dateFormat
    );
    if (
      fromAsString === toAsString ||
      range.fromDateTime === range.toDateTime
    ) {
      return `${fromAsString}`;
    }
    return dateFormat
      ? `${fromAsString} - ${toAsString}`
      : `${fromAsString}/${toAsString}`;
  }
  return `${asIso(range.fromDateTime)} - ${asIso(range.toDateTime)}`;
}

export const eventMidpoint = (node: SomeNode): DateTime | undefined => {
  if (isEventNode(node)) {
    return dateMidpoint(toDateRange(eventValue(node).dateRangeIso));
  } else {
    if (!node.range || !node.range.fromDateTime || !node.range.toDateTime)
      return undefined;
  }
  return dateMidpoint(node.range);
};

export const dateMidpoint = (range: DateRange): DateTime => {
  return range.fromDateTime.plus({
    seconds: range.toDateTime.diff(range.fromDateTime).as("seconds") / 2,
  });
};

function isMinuteStartOrEnd(dateTime: DateTime, scale: DisplayScale) {
  if (!["day", "hour", "minute", "second"].includes(scale)) {
    return false;
  }
  return [57, 58, 59, 0, 1, 2, 3].includes(dateTime.second);
}

function isDayStartOrEnd(dateTime: DateTime, scale: DisplayScale) {
  if (!["month", "day"].includes(scale)) {
    return false;
  }
  return [23, 0, 1].includes(dateTime.hour);
}

function isMonthStartOrEnd(dateTime: DateTime, scale: DisplayScale) {
  if (!["decade", "year", "month"].includes(scale)) {
    return false;
  }
  return [28, 29, 30, 31, 1, 2].includes(dateTime.day);
}

function isYearStartOrEnd(dateTime: DateTime, scale: DisplayScale): boolean {
  if (!["cent", "decade", "year", "month"].includes(scale)) {
    return false;
  }
  if (dateTime.month === 12 && (dateTime.day === 31 || dateTime.day === 30)) {
    return true;
  }
  if (dateTime.month === 1 && (dateTime.day === 1 || dateTime.day === 2)) {
    return true;
  }
  return false;
}

function dateTimeToString(
  dateTime: DateTime,
  scale: DisplayScale,
  isStartDate: boolean,
  dateFormat: DateFormat | undefined
): string | undefined {
  if (isYearStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const fromYear = dateTime.plus({ days: 2 }).year;
      return `${fromYear}`;
    } else {
      const toYear = dateTime.minus({ days: 2 }).year;
      return `${toYear}`;
    }
  }
  if (isMonthStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const adjustedForward = dateTime.plus({ days: 2 });
      const adjustedMonth =
        adjustedForward.month < 10
          ? "0" + adjustedForward.month
          : adjustedForward.month;
      return dateFormat
        ? `${adjustedMonth}/${adjustedForward.year}`
        : `${adjustedForward.year}-${adjustedMonth}`;
    } else {
      const adjustedBack = dateTime.minus({ days: 2 });
      const adjustedMonth =
        adjustedBack.month < 10 ? "0" + adjustedBack.month : adjustedBack.month;
      return dateFormat
        ? `${adjustedMonth}/${adjustedBack.year}`
        : `${adjustedBack.year}-${adjustedMonth}`;
    }
  }
  if (isDayStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const adjustedForward = dateTime.plus({ hours: 2 });
      return dateFormat
        ? dayFormat(adjustedForward, dateFormat)
        : adjustedForward.toISODate();
    } else {
      const adjustedBack = dateTime.minus({ hours: 2 });
      return dateFormat
        ? dayFormat(adjustedBack, dateFormat)
        : adjustedBack.toISODate();
    }
  }
}

function dayFormat(dateTime: DateTime, dateFormat: DateFormat): string {
  const day = dateTime.day;
  const month = dateTime.month;
  const year = dateTime.year;
  if (dateFormat === AMERICAN_DATE_FORMAT) {
    return `${month}/${day}/${year}`;
  } else if (dateFormat === EUROPEAN_DATE_FORMAT) {
    return `${day}/${month}/${year}`;
  }
  return "unexpected date format";
}

function asIso(dateTime: DateTime): string {
  return dateTime.toUTC().toISO({ includeOffset: false }) + "Z";
}
