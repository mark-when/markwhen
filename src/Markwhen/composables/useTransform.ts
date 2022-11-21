import type { Node } from "@markwhen/parser/lib/Node";
// import type { Sort } from "@markwhen/parser/lib/Sort";

// This is particularly for the 'untagged' filter case, because the root node
// isn't going to have any tags
export const transformRoot = (node: Node, filter: string[], filterUntagged: boolean) => {
  const cloned = node.blankClone();
  cloned.value = (node.value as Array<Node>).flatMap((n) => {
    const transformed = transform(n, filter, filterUntagged);
    return transformed ? [transformed] : [];
  });
  return cloned.value.length ? cloned : undefined;
}

export const transform = (
  node: Node,
  filter: string[],
  filterUntagged: boolean
): Node | undefined => {
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

  const tags = node.tags;
  if (filterUntagged) {
    if (!tags || tags?.length === 0) {
      return node;
    }
    if (filter.length) {
      if (tags?.some((tag) => filter.includes(tag))) {
        return node;
      }
      const cloned = node.blankClone();
      cloned.value = (node.value as Array<Node>).flatMap((n) => {
        const transformed = transform(n, filter, filterUntagged);
        return transformed ? [transformed] : [];
      });
      return cloned.value.length ? cloned : undefined;
    }
    return undefined;
  }
  if (!filter.length) {
    return node;
  }
  if (tags?.some((tag) => filter.includes(tag))) {
    return node;
  }
  const cloned = node.blankClone();
  cloned.value = (node.value as Array<Node>).flatMap((n) => {
    const transformed = transform(n, filter, filterUntagged);
    return transformed ? [transformed] : [];
  });
  return cloned.value.length ? cloned : undefined;
};
