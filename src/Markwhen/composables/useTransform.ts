import { Node } from "@markwhen/parser/lib/Node";
// import type { Sort } from "@markwhen/parser/lib/Sort";
import { Event } from "@markwhen/parser/lib/Types";

export const transform = (
  events: Node,
  // sort: Sort,
  filter: string[],
  filterUntagged: boolean
) => {
  const filterFunction = (node: Node): boolean => {
    const tags = node.isEventNode() ? node.eventValue().event.tags : node.tags;
    if (filterUntagged) {
      if (tags?.length === 0) {
        return true;
      }
      if (filter.length) {
        return tags?.some((tag) => filter.includes(tag)) || false;
      }
      return false;
    }
    if (!filter.length) {
      return true;
    }
    return tags?.some((tag) => filter.includes(tag)) || false;
  };

  let filtered = new Node([]);
  for (const { node } of events) {
    if (filterFunction(node)) {
      filtered.push(node.blankClone());
    }
  }
  // filtered = sortEvents(filtered, sort);
  return filtered;
};
