import type {
  SomeNode,
  GroupRange,
  NodeArray,
} from "@markwhen/parser/lib/Node";
import { Event, toDateRange, type DateRange } from "@markwhen/parser/lib/Types";
import { expand } from "@markwhen/parser/lib/utilities/recurrence";
import LRUCache from "lru-cache";

const cache = new LRUCache<string, DateRange>({ max: 1000 });
const cacheAndReturn = (cacheKey: string, dateRange: DateRange) => {
  cache.set(cacheKey, dateRange);
  return dateRange;
};
export const eventRange = (e: Event, recurrenceLimit: number) => {
  const cacheKey =
    JSON.stringify(e.dateRangeIso) + JSON.stringify(e.recurrence);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (e.recurrence) {
    const expanded = expand(
      toDateRange(e.dateRangeIso),
      e.recurrence,
      recurrenceLimit
    );
    return cacheAndReturn(cacheKey, {
      fromDateTime: expanded[0].fromDateTime,
      toDateTime: expanded[expanded.length - 1].toDateTime,
    });
  } else {
    return cacheAndReturn(cacheKey, toDateRange(e.dateRangeIso));
  }
};

export type RecurrenceRangeOptions = {
  recurrenceLimit: number;
};

export const ranges = (root: SomeNode, recurrenceLimit: number): GroupRange => {
  if (!root || !root.value) {
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
