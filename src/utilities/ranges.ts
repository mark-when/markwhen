import {
  type Recurrence,
  type Duration,
  recurrenceDurationUnits,
} from "@markwhen/parser/lib/dateRange/checkRecurrence";
import type {
  SomeNode,
  GroupRange,
  NodeArray,
} from "@markwhen/parser/lib/Node";
import { Event, toDateRange, type DateRange } from "@markwhen/parser/lib/Types";
import LRUCache from "lru-cache";
import { Duration as DTDuration } from "luxon";

const cache = new LRUCache<string, DateRange>({ max: 1000 });

const estimateExpandedRecurrence = (
  dateRange: DateRange,
  limit: number,
  recurrence?: Recurrence
): DateRange => {
  if (!recurrence) {
    return dateRange;
  }
  const instanceDuration = dateRange.toDateTime.diff(dateRange.fromDateTime);
  const startTime = dateRange.fromDateTime;
  const untilTimes = Math.min(recurrence.for?.times || limit, limit);

  const combined = {} as Duration;
  for (const unit of recurrenceDurationUnits) {
    combined[unit] =
      recurrence.every[unit] && recurrence.every[unit]! * untilTimes;
  }

  let untilDate = startTime.plus(DTDuration.fromObject(combined));
  const altUntilDate =
    recurrence.for &&
    !recurrence.for.times &&
    startTime.plus(DTDuration.fromObject(recurrence.for));

  untilDate = altUntilDate
    ? untilDate < altUntilDate
      ? untilDate
      : altUntilDate
    : untilDate;

  return {
    fromDateTime: startTime,
    toDateTime: untilDate.plus(instanceDuration),
  };
};

export const eventRange = (e: Event, recurrenceLimit: number) => {
  const cacheKey =
    JSON.stringify(e.dateRangeIso) + JSON.stringify(e.recurrence);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const range = estimateExpandedRecurrence(
    toDateRange(e.dateRangeIso),
    100,
    e.recurrence
  );
  cache.set(cacheKey, range);
  return range;
};

export type RecurrenceRangeOptions = {
  recurrenceLimit: number;
};

export const ranges = (root: SomeNode, recurrenceLimit: number): GroupRange => {
  if (!root.value) {
    return undefined;
  }

  if (!Array.isArray(root.value)) {
    const eRange = eventRange(root.value, recurrenceLimit);
    return {
      ...eRange,
      maxFrom: eRange.fromDateTime,
    };
  }

  const childRanges = (root.value as NodeArray).reduce((prev, curr) => {
    const currRange: GroupRange = ranges(curr, recurrenceLimit);
    if (!prev) {
      return currRange;
    }
    if (!currRange) {
      return currRange;
    }

    const min =
      +currRange.fromDateTime < +prev.fromDateTime
        ? currRange.fromDateTime
        : prev.fromDateTime;
    const max =
      +currRange.toDateTime > +prev.toDateTime
        ? currRange.toDateTime
        : prev.toDateTime;
    const maxFrom =
      +currRange.maxFrom > +prev.maxFrom ? currRange.maxFrom : prev.maxFrom;

    const range = {
      fromDateTime: min,
      toDateTime: max,
      maxFrom,
    };
    return range;
  }, undefined as GroupRange);

  return childRanges;
};
