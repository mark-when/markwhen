import { exampleTimeline } from "@/exampleTimeline";
import { parse } from "@markwhen/parser";
import type {
  Tags,
  Timeline,
  TimelineMetadata,
} from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";

export const useMarkwhenStore = defineStore({
  id: "markwhen",
  state: () => ({
    rawTimelineString: exampleTimeline,
  }),
  getters: {
    timelines(state): Timeline[] {
      return parse(state.rawTimelineString).timelines;
    },
  },
});
