import type { Recurrence } from "@markwhen/parser/lib/dateRange/checkRecurrence";
import {
  Block,
  BlockType,
  Image,
  type DateRangeIso,
  type DateTimeIso,
  type EventDescription,
  type MarkdownBlock,
  type Range,
} from "@markwhen/parser/lib/Types";

export const bothDefined = <T>(a: T | undefined, b: T | undefined) => {
  if (typeof a === "undefined" && typeof b === "undefined") {
    return true;
  }
  if (typeof a === "undefined") {
    return false;
  }
  if (typeof b === "undefined") {
    return false;
  }
  return true;
};

export const rangeComparator = (a: Range, b: Range) =>
  a.type === b.type &&
  a.content === b.content &&
  a.from === b.from &&
  a.lineFrom.index === b.lineFrom.index &&
  b.lineFrom.line === b.lineFrom.line &&
  a.lineTo.index === b.lineTo.index &&
  a.lineTo.line === b.lineTo.line &&
  a.to === b.to;

export const dateRangeIsoComparator = (a: DateRangeIso, b: DateRangeIso) =>
  dateTimeIsoComparator(a.fromDateTimeIso, b.fromDateTimeIso) &&
  dateTimeIsoComparator(a.toDateTimeIso, b.toDateTimeIso);

export const stringComparator = (a: string, b: string) => a === b;

export const dateTimeIsoComparator = stringComparator;

export const stringArrayComparator = (a: string[], b: string[]) =>
  a.length === b.length && a.every((s, i) => s === b[i]);

export const eventDescriptionComparator = (
  a: EventDescription,
  b: EventDescription
) =>
  a.id === b.id &&
  a.eventDescription === b.eventDescription &&
  stringArrayComparator(a.locations, b.locations) &&
  matchedListItemsComparator(a.matchedListItems, b.matchedListItems) &&
  a.percent === b.percent &&
  supplementalComparator(a.supplemental, b.supplemental) &&
  stringArrayComparator(a.tags, b.tags);

export const matchedListItemsComparator = (a: Range[], b: Range[]) =>
  a.length == b.length && a.every((r, i) => rangeComparator(r, b[i]));

export const supplementalComparator = (
  a: MarkdownBlock[],
  b: MarkdownBlock[]
) =>
  a.length === b.length && a.every((s, i) => markdownBlockComparator(s, b[i]));

export const markdownBlockComparator = (a: MarkdownBlock, b: MarkdownBlock) => {
  if (a.type !== b.type) {
    return false;
  }
  if (a.type === BlockType.IMAGE) {
    return (
      (a as Image).altText === (b as Image).altText &&
      (a as Image).link === (b as Image).link
    );
  }
  return (
    (a as Block).raw === (b as Block).raw &&
    (a as Block).value === (b as Block).value
  );
};

export const recurrenceComparator = (a?: Recurrence, b?: Recurrence) => {
  if (!a || !b) {
    return false;
  }
  if (a.for) {
    if (!b.for) {
      return false;
    } else {
      const aFor = Object.keys(a.for) as (keyof typeof a.for)[];
      const bFor = Object.keys(b.for) as (keyof typeof b.for)[];
      if (aFor.sort().join(",") !== bFor.sort().join(",")) {
        return false;
      }
      for (const aKey of aFor) {
        if (a.for[aKey] !== b.for[aKey]) {
          return false;
        }
      }
    }
  } else {
    if (b.for) {
      return false;
    }
  }
  const aEvery = Object.keys(a.every) as (keyof typeof a.every)[];
  const bEvery = Object.keys(b.every) as (keyof typeof b.every)[];
  if (aEvery.sort().join(",") !== bEvery.sort().join(",")) {
    return false;
  }
  for (const aKey of aEvery) {
    if (a.every[aKey] !== b.every[aKey]) {
      return false;
    }
  }
  return true;
};
