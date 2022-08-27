import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { defineStore } from "pinia";
import { PAGE_BREAK } from "@markwhen/parser/lib/regex";
import type { DateFormat, DateRange, Event, Timeline } from "@markwhen/parser/lib/Types";
import { ref } from "vue";
import { usePageStore } from "@/Markwhen/pageStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import { dateRangeToString } from "@/Views/Timeline/utilities/dateTimeUtilities";

// Edit
// export const ADD_PAGE = "edit:pages:add";
// export const MOVE_PAGES = "edit:pages:move";
// export const DELETE_PAGE = "edit:pages:delete";

// export const EDIT_EVENT_DATE_RANGE = "edit:event:dateRange";
// export const CREATE_EVENT_FROM_RANGE = "edit:event:createFromRange";
// export const MOVE_EVENT_UP = "edit:event:moveUp";
// export const MOVE_EVENT_DOWN = "edit:event:moveDown";

// // View
// export const HOVER_EVENT = "view:event:hover";
// export const DETAIL_EVENT = "view:event:detail";

// type EditMethod =
//   | typeof ADD_PAGE
//   | typeof MOVE_PAGES
//   | typeof DELETE_PAGE
//   | typeof EDIT_EVENT_ = "view:event:detail";

// type EditMethod =
//   | typeof ADD_PAGE
//   | typeof MOVE_PAGES
//   | typeof DELETE_PAGE
//   | typeof EDIT_EVENT_DATE_RANGE
//   | typeof CREATE_EVENT_FROM_RANGE
//   | typeof MOVE_EVENT_UP
//   | typeof MOVE_EVENT_DOWN;

// export type UpdateMethod =
//   | EditMethod
//   | typeof HOVER_EVENT
//   | typeof DETAIL_EVENT;

export const equivalentEvents = (e1?: Event | null, e2?: Event | null) => {
  if (!e1 || !e2) {
    return false;
  }
  return e1.ranges.event.from === e2.ranges.event.from;
};

export const useEditorOrchestratorStore = defineStore(
  "editorOrchestrator",
  () => {
    const markwhenStore = useMarkwhenStore();
    const pageStore = usePageStore();
    const markersStore = useMarkersStore();

    const editable = ref(true);
    const showTagFilterButtons = ref(true);
    const showPageButtons = ref(true);
    const hoveringEvent = ref<Event | null>(null);

    const addPage = () => {
      markwhenStore.setRawTimelineString(
        markwhenStore.rawTimelineString
          .concat(PAGE_BREAK)
          .concat(`title: Page ${markwhenStore.timelines.length + 1}`)
      );
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

      markwhenStore.setRawTimelineString(
        currentTimelineString.substring(0, startIndex) +
          currentTimelineString.substring(endIndex)
      );
    };

    const editEventDateRange = (event: Event, range: DateRange) => {
      if (equivalentRanges(event.ranges.date, range)) {
        return;
      }
      const timelineString = markwhenStore.rawTimelineString;
      const preferredInterpolationFormat = pageStore.pageTimelineMetadata
        .preferredInterpolationFormat as DateFormat | undefined;
      const scale = markersStore.scaleOfViewportDateInterval;

      const inTextFrom = event.ranges.date.dateRangeInText.from;
      const inTextTo = event.ranges.date.dateRangeInText.to;
      const pre = timelineString.slice(0, inTextFrom);
      const post = timelineString.slice(inTextTo);

      markwhenStore.setRawTimelineString(
        pre +
          `${dateRangeToString(range, scale, preferredInterpolationFormat)}:` +
          post
      );
    };

    const setHoveringEvent = (e: Event | null) => {
      hoveringEvent.value = e;
    };

    const createEventFromRange = (range: DateRange | undefined) => {
      if (!range) {
        return;
      }
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
