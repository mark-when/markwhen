import type {
  SomeNode,
  GroupRange,
  NodeArray,
} from "@markwhen/parser/lib/Node";
import {
  Event,
  toDateRange,
  type DateRange,
} from "@markwhen/parser/lib/Types";
import LRUCache from "lru-cache";

const cache = new LRUCache<string, DateRange>({ max: 1000 });

export const eventRange = (e: Event) => {
  const cacheKey = JSON.stringify(e.dateRangeIso);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const range = toDateRange(e.dateRangeIso);
  cache.set(cacheKey, range);
  return range;
};

export const ranges = (root: SomeNode): GroupRange => {
  if (!root.value) {
    return undefined;
  }

  if (!Array.isArray(root.value)) {
    return {
      ...eventRange(root.value),
      maxFrom: eventRange(root.value).fromDateTime,
    };
  }

  const childRanges = (root.value as NodeArray).reduce((prev, curr) => {
    const currRange: GroupRange = ranges(curr);
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
