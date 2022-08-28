import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { defineStore } from "pinia";
import { PAGE_BREAK } from "@markwhen/parser/lib/regex";
import {
  Event,
  type DateFormat,
  type DateRange,
  type EventSubGroup,
  type Timeline,
} from "@markwhen/parser/lib/Types";
import { ref } from "vue";
import { usePageStore } from "@/Markwhen/pageStore";
import {
  dateRangeToString,
  type DisplayScale,
} from "@/Views/Timeline/utilities/dateTimeUtilities";

export const equivalentEvents = (
  e1?: Event | EventSubGroup | null,
  e2?: Event | EventSubGroup | null
) => {
  if (!e1 || !e2) {
    return false;
  }
  if (e1 instanceof Event && e2 instanceof Event) {
    return e1.ranges.event.from === e2.ranges.event.from;
  }
  if (e1 instanceof Event || e2 instanceof Event) {
    // They weren't both Events
    return false
  }
  return equivalentSubgroups(e1, e2);
};

export const equivalentSubgroups = (e1: EventSubGroup, e2: EventSubGroup) => {

};

export const useEditorOrchestratorStore = defineStore(
  "editorOrchestrator",
  () => {
    const markwhenStore = useMarkwhenStore();
    const pageStore = usePageStore();

    const editable = ref(true);
    const showTagFilterButtons = ref(true);
    const showPageButtons = ref(true);
    const hoveringEvent = ref<Event | null>(null);

    const addPage = () => {
      const newString = markwhenStore.rawTimelineString
        .concat(PAGE_BREAK)
        .concat(`title: Page ${markwhenStore.timelines.length + 1}`);

      markwhenStore.setRawTimelineString(newString);
    };

    const movePages = (from: number, to: number) => {
      const timelineString = markwhenStore.rawTimelineString;
      const timelines = markwhenStore.timelines;

      if (from === to) {
        return timelineString;
      }
      // Just do it heavy-handedly
      const sub = (from: number, to: number) =>
        timelineString.substring(from, to);
      const order = newOrder(
        timelines.map((c, i) => i),
        from,
        to
      );

      const newString = order
        .map((i) => {
          const metadata = timelines[i].metadata;
          const start = metadata.startStringIndex;
          const end = metadata.endStringIndex;
          return sub(start, end);
        })
        .join(PAGE_BREAK);

      markwhenStore.setRawTimelineString(newString);
    };

    const deletePage = (index: number) => {
      const timelineString = markwhenStore.rawTimelineString;
      const timelines = markwhenStore.timelines;
      if (timelines.length === 1) {
        return "";
      }

      // If we're deleting the first page, we delete the
      // break after if, otherwise we delete the break before it
      const timeline = timelines[index] as Timeline;
      const currentTimelineString = timelineString || "";

      let startIndex = timeline.metadata.startStringIndex;
      let endIndex = timeline.metadata.endStringIndex;
      if (index === 0) {
        endIndex += PAGE_BREAK.length;
      } else {
        startIndex -= PAGE_BREAK.length;
      }

      const newString =
        currentTimelineString.substring(0, startIndex) +
        currentTimelineString.substring(endIndex);

      markwhenStore.setRawTimelineString(newString);
    };

    const editEventDateRange = (
      event: Event,
      range: DateRange,
      scale: DisplayScale,
      preferredInterpolationFormat: DateFormat | undefined
    ) => {
      if (equivalentRanges(event.ranges.date, range)) {
        return;
      }
      const timelineString = markwhenStore.rawTimelineString;

      const inTextFrom = event.ranges.date.dateRangeInText.from;
      const inTextTo = event.ranges.date.dateRangeInText.to;
      const pre = timelineString.slice(0, inTextFrom);
      const post = timelineString.slice(inTextTo);

      const newString =
        pre +
        `${dateRangeToString(range, scale, preferredInterpolationFormat)}:` +
        post;

      markwhenStore.setRawTimelineString(newString);
    };

    const setHoveringEvent = (e: Event | null) => {
      hoveringEvent.value = e;
    };

    const createEventFromRange = (
      range: DateRange | undefined,
      scale: DisplayScale,
      preferredInterpolationFormat: DateFormat | undefined
    ) => {
      if (!range) {
        return;
      }
      const dateRangeString = dateRangeToString(
        range,
        scale,
        preferredInterpolationFormat
      );
      const events = pageStore.pageTimeline.events.flat();
      const lastIndexOfLastEvent = events.length
        ? events[events.length - 1].ranges.event.to
        : pageStore.pageTimeline.metadata.endStringIndex;

      const es = markwhenStore.rawTimelineString;
      const newString =
        es.slice(0, lastIndexOfLastEvent) +
        `\n${dateRangeString}: Event\n` +
        es.slice(lastIndexOfLastEvent);

      markwhenStore.setRawTimelineString(newString);
    };

    const isEventHoveredInEditor = (e: Event) =>
      equivalentEvents(hoveringEvent.value, e);

    return {
      // state
      editable,
      showTagFilterButtons,
      showPageButtons,
      hoveringEvent,

      // actions
      addPage,
      movePages,
      deletePage,
      editEventDateRange,
      setHoveringEvent,
      createEventFromRange,

      // getters
      isEventHoveredInEditor,
    };
  }
);

const equivalentRanges = (r1: DateRange, r2: DateRange) =>
  +r1.fromDateTime === +r2.fromDateTime && +r1.toDateTime === +r2.toDateTime;

// const editorTransformer = (
//   timelineString: string,
//   method: EditMethod,
//   timelines: Timeline[],
//   arg?: any
// ): string => {
//   switch (method) {
//     case ADD_PAGE:
//       return addPage(timelineString, timelines);
//     case MOVE_PAGES:
//       return movePages(timelineString, timelines, arg.from, arg.to);
//     case DELETE_PAGE:
//       return DELETE_PAGE(timelineString, timelines, arg);
//   }
//   return "";
// };

export const newOrder = (order: number[], from: number, to: number) => {
  if (from > to) {
    order.splice(from, 1);
    order.splice(to, 0, from);
  } else {
    order.splice(to + 1, 0, from);
    order.splice(from, 1);
  }
  return order;
};
