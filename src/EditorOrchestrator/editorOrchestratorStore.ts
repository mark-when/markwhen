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
import { useEventMapStore, type EventPaths } from "@/Markwhen/eventMapStore";

export const useEditorOrchestratorStore = defineStore(
  "editorOrchestrator",
  () => {
    const markwhenStore = useMarkwhenStore();
    const pageStore = usePageStore();
    const eventMapStore = useEventMapStore();

    const editable = ref(true);
    const showTagFilterButtons = ref(true);
    const hoveringEventPaths = ref<EventPaths | null>(null);
    const choosingColor = ref(false);

    const setText  = (text: string) => {
      markwhenStore.setRawTimelineString(text);
    }

    const addPage = () => {
      const newString = markwhenStore.rawTimelineString
        .concat(PAGE_BREAK)
        .concat(`title: Page ${markwhenStore.timelines.length + 1}`);

        setText(newString);
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

        setText(newString);
    };

    const setPageTimelineString = (newString: string) => {
      const pageMetadata = pageStore.pageTimelineMetadata;
      const currentTimelineString = markwhenStore.rawTimelineString;
      const pre = currentTimelineString.substring(
        0,
        pageMetadata.startStringIndex
      );
      const post = currentTimelineString.substring(pageMetadata.endStringIndex);
      const newTimelineString = pre + newString + post;

      setText(newTimelineString);
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

        setText(newString);
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

        setText(newString);
    };

    const clearHoveringEvent = () => {
      hoveringEventPaths.value = null;
    };

    const setHoveringEventPaths = (paths: EventPaths) => {
      hoveringEventPaths.value = paths;
    };

    const setHoveringEvent = (e: Event | EventSubGroup | number) => {
      hoveringEventPaths.value = eventMapStore.getAllPaths(e);
    };

    const setChoosingColor = (choosing: boolean) => {
      choosingColor.value = choosing;
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

        setText(newString);
    };

    const indexInString = (e: Event | EventSubGroup) => {
      if (e instanceof Event) {
        return e.ranges.event.from + 1;
      } else {
        return e.rangeInText!.from + 1;
      }
    };

    const isEventPaths = (e: any): e is EventPaths => {
      return "whole" in e || "pageFiltered" in e || "page" in e;
    };

    const showInEditor = (e: Event | EventSubGroup | EventPaths) => {
     
    };

    return {
      // state
      editable,
      showTagFilterButtons,
      hoveringEventPaths,
      choosingColor,

      // actions
      addPage,
      movePages,
      deletePage,
      editEventDateRange,
      setHoveringEvent,
      setHoveringEventPaths,
      clearHoveringEvent,
      createEventFromRange,
      setChoosingColor,
      setPageTimelineString,
      showInEditor,
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
