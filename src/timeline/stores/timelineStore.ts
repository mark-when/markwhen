import { defineStore } from "pinia";
import { parse } from "@markwhen/parser";
import type { Timeline, TimelineMetadata } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import {
  diffScale,
  floorDateTime,
  viewportLeftMarginPixels,
  type DateInterval,
  type DisplayScale,
} from "../utilities/dateTimeUtilities";

export interface Viewport {
  left: number;
  width: number;
  top: number;
}

export interface Settings {
  scale: number;
  viewportDateInterval: DateInterval;
  viewport: Viewport;
  sort: Sort;
  filter: string[];
}

export type Sort = "none" | "down" | "up";

export const MIN_SCALE = 0.04;
export const MAX_SCALE = 30000000;
const initialScale = 0.3;

export function blankSettings(): Settings {
  return {
    scale: initialScale,
    viewportDateInterval: {
      from: DateTime.now().minus({ years: 10 }),
      to: DateTime.now().plus({ years: 10 }),
    },
    viewport: { left: 0, width: 0, top: 0 },
    sort: "none",
    filter: [],
  };
}

export const useTimelineStore = defineStore({
  id: "timeline",
  state: () => ({
    rawTimelineString: "",
    pageIndex: 0,
    allSettings: [blankSettings()],
  }),
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
    pageSettings(state): Settings {
      return state.allSettings[state.pageIndex];
    },
    pageScale(state): number {
      return this.pageSettings.scale;
    },
    baselineLeftmostDate(state): DateTime {
      const md = this.pageTimelineMetadata;
      const earliestTime = md.earliestTime;
      const days = md.maxDuration.as("days");

      if (days < 0.1) {
        return floorDateTime(earliestTime.minus({ hours: 1 }), "hour");
      }
      if (days < 1) {
        return floorDateTime(earliestTime.minus({ days: 1 }), "day");
      }
      if (days < 30) {
        return floorDateTime(earliestTime.minus({ months: 4 }), "year");
      }
      if (days < 180) {
        return floorDateTime(earliestTime.minus({ months: 3 }), "year");
      }
      return floorDateTime(earliestTime, "year");
    },
    dateIntervalFromViewport(
      state
    ): (scrollLeft: number, width: number) => DateInterval {
      return (scrollLeft: number, width: number) => {
        // We're adding these so that when we are scrolling it looks like the left
        // time markers are going off the screen
        scrollLeft = scrollLeft - viewportLeftMarginPixels;
        width = width + viewportLeftMarginPixels;

        const earliest = this.baselineLeftmostDate;
        const leftDate = earliest.plus({
          [diffScale]: (scrollLeft / this.pageScale) * 24,
        });
        const rightDate = earliest.plus({
          [diffScale]: ((scrollLeft + width) / this.pageScale) * 24,
        });
        return { from: leftDate, to: rightDate };
      };
    },
    scalelessDistanceBetweenDates(state) {
      return (a: DateTime, b: DateTime) => b.diff(a).as(diffScale);
    },
    distanceBetweenDates(state) {
      return (a: DateTime, b: DateTime) =>
        (b.diff(a).as(diffScale) * this.pageScale) / 24;
    },
  },
  actions: {
    setViewport(viewport: Viewport) {
      this.pageSettings.viewport = viewport;
      this.pageSettings.viewportDateInterval = this.dateIntervalFromViewport(
        viewport.left,
        viewport.width
      );
    },
    setPageScale(scale: number) {
      this.pageSettings.scale = scale
    }
  },
});
