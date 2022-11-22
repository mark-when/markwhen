import type { Node, NodeArray, NodeValue, SomeNode } from "@markwhen/parser/lib/Node";
import type { Sort } from "../transformStore";

// This is particularly for the 'untagged' filter case, because the root node
// isn't going to have any tags
export const transformRoot = (
  node: Node<NodeArray>,
  filter: string[],
  filterUntagged: boolean,
  sort: Sort
) => {
  const cloned = node.blankClone();
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
  if (node.isEventNode()) {
    const tags = node.eventValue().event.tags;
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
  const cloned = node.blankClone();
  cloned.value = node.value.flatMap((n) => {
    const transformed = transform(n, filter, filterUntagged, sort);
    return transformed ? [transformed] : [];
  });
  if (!cloned.value.length) {
    return undefined;
  }
  return cloned;
};

const sortNodeArray = (node: Node<NodeArray> | undefined, sort: Sort) => {
  // debugger
  if (!node) {
    return undefined;
  }
  if (sort === "none") {
    return node;
  }
  const cloned = node.blankClone();
  cloned.value = node.value
    .flatMap((n) => {
      if (!n) {
        return [];
      }
      if (n.isEventNode()) {
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
        n.isEventNode()
          ? n.eventValue().ranges.date.fromDateTime
          : n.ranges()?.fromDateTime;

      const leftDateTime = fromDateTime(left);
      const rightDateTime = fromDateTime(right);
      return sort === "down"
        ? +(leftDateTime || 0) - +(rightDateTime || 0)
        : +(rightDateTime || 0) - +(leftDateTime || 0);
    });
  return cloned;
};
