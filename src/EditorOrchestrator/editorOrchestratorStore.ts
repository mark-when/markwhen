import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { defineStore } from "pinia";
import { PAGE_BREAK } from "@markwhen/parser/lib/regex";
import type { Event, Timeline } from "@markwhen/parser/lib/Types";
import { computed, ref } from "vue";

export const ADD_PAGE = "edit:pages:add";
export const MOVE_PAGES = "edit:pages:move";
export const DELETE_PAGE = "edit:pages:delete";
export const EDIT_EVENT_DATE_RANGE = "edit:event:dateRange";
export const CREATE_EVENT_FROM_RANGE = "edit:event:createFromRange";
export const HOVER_EVENT = "view:event:hover";

export type UpdateMethod =
  | typeof ADD_PAGE
  | typeof MOVE_PAGES
  | typeof DELETE_PAGE
  | typeof EDIT_EVENT_DATE_RANGE
  | typeof CREATE_EVENT_FROM_RANGE
  | typeof HOVER_EVENT;

export const useEditorOrchestratorStore = defineStore(
  "editorOrchestrator",
  () => {
    const editable = ref(true);
    const showTagFilterButtons = ref(true);
    const showPageButtons = ref(true);
    const hoveringEvent = ref<Event | null>(null);

    const update = (updateMethod: UpdateMethod, arg?: any) => {
      if (updateMethod === HOVER_EVENT) {
        hoveringEvent.value = arg ? arg : null;
      }
      console.log(updateMethod, arg);
    };

    const isEventHoveredInEditor = (e: Event) => {
      return (
        hoveringEvent.value?.ranges.event.from === e.ranges.event.from &&
        hoveringEvent.value.ranges.event.to === e.ranges.event.to
      );
    }

    return {
      // state
      editable,
      showTagFilterButtons,
      showPageButtons,
      hoveringEvent,

      // actions
      update,

      // getters
      isEventHoveredInEditor
    };
  }
);

const editorTransformer = (
  timelineString: string,
  method: UpdateMethod,
  timelines: Timeline[],
  args?: any
): string => {
  switch (method) {
    case ADD_PAGE:
      return addPage(timelineString, timelines);
  }
  return "";
};

const addPage = (timelineString: string, timelines: Timeline[]): string => {
  return timelineString
    .concat(PAGE_BREAK)
    .concat(`title: Page ${timelines.length + 1}`);
};
