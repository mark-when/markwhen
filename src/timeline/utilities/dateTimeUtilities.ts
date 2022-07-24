import { DateTime } from "luxon";
import { Weight } from "../markers/markersStore";

export type DisplayScale =
  | "second"
  | "quarterminute"
  | "minute"
  | "quarterhour"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "decade";

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
];

export function dateScale(dateTime: DateTime) {
  if (dateTime.second === 0) {
    if (dateTime.minute === 0) {
      if (dateTime.hour === 0) {
        if (dateTime.day === 1) {
          if (dateTime.month === 1) {
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
  if (toScale === "decade") {
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
