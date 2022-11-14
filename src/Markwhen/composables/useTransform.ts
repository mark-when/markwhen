import type { Sort } from "@markwhen/parser/lib/Sort";
import sortEvents from "@markwhen/parser/lib/Sort";
import {
  Event,
  type Events,
  type EventSubGroup,
} from "@markwhen/parser/lib/Types";

export const transform = (
  events: Events,
  sort: Sort,
  filter: string[],
  filterUntagged: boolean
) => {
  const filterFunction = (e: Event | EventSubGroup): boolean => {
    const tags = e instanceof Event ? e.event.tags : e.tags;
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

  let filtered = [];
  for (const eventOrEvents of events) {
    if (eventOrEvents instanceof Event) {
      if (filterFunction(eventOrEvents)) {
        filtered.push(eventOrEvents);
      }
    } else {
      const group = [...eventOrEvents] as EventSubGroup;
      group.range = eventOrEvents.range;
      group.tags = eventOrEvents.tags;
      group.title = eventOrEvents.title;
      group.startExpanded = eventOrEvents.startExpanded;
      group.style = eventOrEvents.style;
      group.rangeInText = eventOrEvents.rangeInText;
      if (filterFunction(group)) {
        filtered.push(group);
      } else {
        const filteredSubEvents: EventSubGroup = group.filter(filterFunction);
        if (filteredSubEvents.length) {
          filteredSubEvents.range = group.range;
          filteredSubEvents.tags = group.tags;
          filteredSubEvents.title = group.title;
          filteredSubEvents.startExpanded = group.startExpanded;
          filteredSubEvents.style = group.style;
          filteredSubEvents.rangeInText = group.rangeInText;
          filtered.push(filteredSubEvents);
        }
      }
    }
  }
  filtered = sortEvents(filtered, sort);
  return filtered;
};
