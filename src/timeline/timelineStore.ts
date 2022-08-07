import { defineStore } from "pinia";
import type { Timeline, TimelineMetadata } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import {
  diffScale,
  floorDateTime,
  viewportLeftMarginPixels,
  type DateInterval,
} from "@/Timeline/utilities/dateTimeUtilities";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";

export interface Viewport {
  left: number;
  width: number;
  top: number;
}

export interface Settings {
  scale: number;
  viewportDateInterval: DateInterval;
  viewport: Viewport;
}

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
  };
}

export const useTimelineStore = defineStore({
  id: "timeline",
  state: () => ({
    pageSettings: usePageEffect(() => blankSettings()),
  }),
  getters: {
    pageTimelineMetadata(state): TimelineMetadata {
      return useMarkwhenStore().pageTimelineMetadata
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
    baselineRightmostDate(state): DateTime {
      return floorDateTime(
        this.pageTimelineMetadata.latestTime.plus({ years: 30 }),
        "year"
      );
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
    distanceFromBaselineLeftmostDate(state): (a: DateTime) => number {
      return (a: DateTime) =>
        (a.diff(this.baselineLeftmostDate).as(diffScale) * this.pageScale) / 24;
    },
    distanceBetweenBaselineDates(state): number {
      return this.distanceFromBaselineLeftmostDate(this.baselineRightmostDate);
    },
    dateFromClientLeft(state) {
      return (offset: number) => {
        const leftDate = this.baselineLeftmostDate.plus({
          [diffScale]: (this.pageSettings.viewport.left / this.pageScale) * 24,
        });
        return leftDate.plus({
          [diffScale]: (offset / this.pageScale) * 24,
        });
      };
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
    setPageScale(s: number) {
      // TODO: also limit zooming in based on our position, if it would put us
      // past the browser's limit of a div's width
      const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
      this.pageSettings.scale = scale;
    },
  },
});
