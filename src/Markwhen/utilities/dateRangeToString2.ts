import type { DateFormat, DateRange } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";

export function dateRangeToString(range: DateRange, dateFormat?: DateFormat) {
  let from, to;
  if (!range.fromDateTime.second && !range.fromDateTime.millisecond) {
    if (!range.fromDateTime.minute && !range.fromDateTime.hour) {
      // Just the date
      from = range.fromDateTime.toLocaleString(DateTime.DATE_SHORT);
    } else {
      from = range.fromDateTime.toFormat("M/d/yyyy, h:mma");
    }
  } else {
    from = range.fromDateTime.toISO();
  }
  if (!range.toDateTime.second && !range.toDateTime.millisecond) {
    if (!range.toDateTime.minute && !range.toDateTime.hour) {
      if (+range.toDateTime === +range.fromDateTime) {
        to = range.toDateTime.toLocaleString(DateTime.DATE_SHORT);
      } else {
        // Just the date, but since this is `toDateTime`, it's going
        // to be the day before
        to = range.toDateTime
          .minus({ days: 1 })
          .toLocaleString(DateTime.DATE_SHORT);
      }
    } else {
      to = range.toDateTime.toFormat("M/d/yyyy, h:mma");
    }
  } else {
    to = range.toDateTime.toISO();
  }
  if (from === to) {
    return from;
  }
  return `${from} - ${to}`;
}
