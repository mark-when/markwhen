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
    pageIndex: 0,
    filter: [] as String[],
  }),
  actions: {
    setPageIndex(index: number) {
      this.pageIndex = index;
    },
  },
  getters: {
    timelines(state): Timeline[] {
      return parse(state.rawTimelineString).timelines;
    },
    pageTimeline(state): Timeline {
      return this.timelines[this.pageIndex];
    },
    pageTimelineMetadata(state): TimelineMetadata {
      return this.pageTimeline.metadata;
    },
    pageTimelineString(state): string {
      const selectedTimelineMetadata = this.pageTimeline.metadata;
      return (
        this.rawTimelineString.slice(
          selectedTimelineMetadata.startStringIndex,
          selectedTimelineMetadata.endStringIndex
        ) || ""
      );
    },
    tags(state): Tags {
      return this.pageTimeline.tags;
    },
  },
});
