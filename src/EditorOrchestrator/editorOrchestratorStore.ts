import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { defineStore } from "pinia";
import { PAGE_BREAK } from "@markwhen/parser/lib/regex";
import type { Timeline } from "@markwhen/parser/lib/Types";

export const ADD_PAGE = "edit:pages:add";
export const MOVE_PAGES = "edit:pages:move";
export const DELETE_PAGE = "edit:pages:delete";

export type UpdateMethod =
  | typeof ADD_PAGE
  | typeof MOVE_PAGES
  | typeof DELETE_PAGE;

export const useEditorOrchestratorStore = defineStore("editorOrchestrator", {
  state: () => ({
    editable: false,
  }),
  actions: {
    update(updateMethod: UpdateMethod, args?: any) {
      const markwhenStore = useMarkwhenStore();
      console.log(updateMethod, args)
    },
  },
});

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
  return ''
};

const addPage = (timelineString: string, timelines: Timeline[]): string => {
  return timelineString
    .concat(PAGE_BREAK)
    .concat(`title: Page ${timelines.length + 1}`);
};
