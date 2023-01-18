import { ranges } from "@/utilities/ranges";
import type {
  Node,
  NodeArray,
  NodeValue,
  SomeNode,
} from "@markwhen/parser/lib/Node";
import {
  blankClone,
  eventValue,
  isEventNode,
} from "@markwhen/parser/lib/Noder";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import { recurrenceLimit } from "../pageStore";

import type { Sort } from "../transformStore";

// This is particularly for the 'untagged' filter case, because the root node
// isn't going to have any tags
export const transformRoot = (
  node: Node<NodeArray>,
  filter: string[],
  filterUntagged: boolean,
  sort: Sort
) => {
  const cloned = blankClone(node);
  cloned.value = (node.value as NodeArray).flatMap((n) => {
    const transformed = transform(n, filter, filterUntagged, sort);
    return transformed ? [transformed] : [];
  });
  if (!cloned.value.length) {
    return undefined;
  }
  return sortNodeArray(cloned, sort);
};

export const transform = (
  node: SomeNode,
  filter: string[],
  filterUntagged: boolean,
  sort: Sort
): SomeNode | undefined => {
  if (!node.value) {
    return undefined;
  }
  if (isEventNode(node)) {
    const tags = eventValue(node).eventDescription.tags;
    if (filterUntagged) {
      if (tags.length === 0) {
        return node;
      }
      if (filter.length) {
        return tags.some((tag) => filter.includes(tag)) ? node : undefined;
      }
      return undefined;
    }
    if (!filter.length) {
      return node;
    }
    return tags.some((tag) => filter.includes(tag)) ? node : undefined;
  }

  const n = node as Node<NodeArray>;
  const tags = node.tags;
  if (filterUntagged) {
    if (!tags || tags?.length === 0) {
      return sortNodeArray(n, sort);
    }
    if (filter.length) {
      if (tags?.some((tag) => filter.includes(tag))) {
        return sortNodeArray(n, sort);
      }
      const filtered = filterNodeArray(n, filter, filterUntagged, sort);
      return sortNodeArray(filtered, sort);
    }
    return undefined;
  }
  if (!filter.length) {
    return sortNodeArray(n, sort);
  }
  if (tags?.some((tag) => filter.includes(tag))) {
    return sortNodeArray(n, sort);
  }
  const filtered = filterNodeArray(n, filter, filterUntagged, sort);
  return sortNodeArray(filtered, sort);
};

const filterNodeArray = (
  node: Node<NodeArray>,
  filter: string[],
  filterUntagged: boolean,
  sort: Sort
) => {
  const cloned = blankClone(node);
  cloned.value = node.value.flatMap((n) => {
    const transformed = transform(n, filter, filterUntagged, sort);
    return transformed ? [transformed] : [];
  });
  if (!cloned.value.length) {
    return undefined;
  }
  return cloned;
};

const sortNodeArray = (
  node: Node<NodeArray> | undefined,
  sort: Sort
): Node<NodeArray> | undefined => {
  if (!node) {
    return undefined;
  }
  if (sort === "none") {
    return node;
  }
  const cloned = blankClone(node);
  cloned.value = node.value
    .flatMap((n: SomeNode | undefined): (Node<Event> | Node<NodeArray>)[] => {
      if (!n) {
        return [];
      }
      if (isEventNode(n)) {
        return [n];
      }
      const sorted = sortNodeArray(n as Node<NodeArray>, sort);
      if (sorted) {
        return [sorted];
      }
      return [];
    })
    .sort((left, right) => {
      const fromDateTime = (n: SomeNode) =>
        isEventNode(n)
          ? toDateRange(eventValue(n).dateRangeIso).fromDateTime
          : ranges(n, recurrenceLimit)?.fromDateTime;

      const leftDateTime = fromDateTime(left);
      const rightDateTime = fromDateTime(right);
      return sort === "down"
        ? +(leftDateTime || 0) - +(rightDateTime || 0)
        : +(rightDateTime || 0) - +(leftDateTime || 0);
    });
  return cloned;
};
