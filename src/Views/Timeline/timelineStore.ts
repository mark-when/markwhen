import { defineStore } from "pinia";
import { DateTime } from "luxon";
import {
  diffScale,
  floorDateTime,
  scales,
  viewportLeftMarginPixels,
  type DateInterval,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import { usePageStore } from "@/Markwhen/pageStore";
import { ref, computed, watchEffect, reactive } from "vue";
import type {
  DateRange,
  DateRangePart,
  Path,
} from "@markwhen/parser/lib/Types";
import type { EventPaths } from "../ViewOrchestrator/useStateSerializer";

export enum Weight {
  SECOND = 0,
  QUARTER_MINUTE = 1,
  MINUTE = 2,
  QUARTER_HOUR = 3,
  HOUR = 4,
  DAY = 5,
  MONTH = 6,
  YEAR = 7,
  DECADE = 8,
}

const SECOND = 1;
const QUARTER_MINUTE = 15 * SECOND;
const MINUTE = 60 * SECOND;
const QUARTER_HOUR = 15 * MINUTE;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;
const DECADE = 10 * YEAR;

export type TimelineMode = "timeline" | "rows";
export const timeMarkerWeightMinimum = 0.25;

function roundToTwoDecimalPlaces(n: number): number {
  return Math.floor(n * 100) / 100;
}

export function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(max, Math.max(value, min));
}

export interface Viewport {
  left: number;
  width: number;
  top: number;
  height: number;
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
    viewport: { left: 0, width: 0, top: 0, height: 0 },
  };
}

export const useTimelineStore = defineStore("timeline", () => {
  const viewportGetter = ref<() => Viewport>();
  const pageSettings = usePageEffect(() => blankSettings());
  const startedWidthChange = ref(false);
  const hideNowLine = ref(false);
  const scrollToPath = ref<EventPaths>();
  const showingJumpToRange = ref(false);
  const jumpToRange = ref<DateRangePart>();
  const shouldZoomWhenScrolling = ref<boolean>(false);
  const collapsed = reactive<Set<string>>(new Set());
  const mode = ref<TimelineMode>("timeline");

  const pageTimelineMetadata = computed(
    () => usePageStore().pageTimelineMetadata
  );
  const pageScale = computed(() => pageSettings.value.scale);

  const earliest = computed(() =>
    DateTime.fromISO(pageTimelineMetadata.value.earliestTime)
  );

  const maxDurationDays = computed(
    () => pageTimelineMetadata.value.maxDurationDays
  );

  const baselineLeftmostDate = ref<DateTime>(DateTime.now());

  watchEffect(() => {
    const earliestTime = earliest.value;
    const days = maxDurationDays.value;
    let newValue: DateTime;
    if (days < 0.1) {
      newValue = floorDateTime(earliestTime.minus({ hours: 1 }), "hour");
    }
    if (days < 1) {
      newValue = floorDateTime(earliestTime.minus({ days: 1 }), "day");
    }
    if (days < 30) {
      newValue = floorDateTime(earliestTime.minus({ months: 4 }), "year");
    }
    if (days < 180) {
      newValue = floorDateTime(earliestTime.minus({ months: 3 }), "year");
    }
    newValue = floorDateTime(earliestTime.minus({ months: 6 }), "year");
    if (+newValue !== +baselineLeftmostDate.value) {
      baselineLeftmostDate.value = newValue;
    }
  });

  const blocks = computed(() => {});

  const baselineRightmostDate = computed(() =>
    floorDateTime(
      DateTime.fromISO(pageTimelineMetadata.value.latestTime).plus({
        years: 30,
      }),
      "year"
    )
  );
  const dateIntervalFromViewport = computed(() => {
    return (scrollLeft: number, width: number) => {
      // We're adding these so that when we are scrolling it looks like the left
      // time markers are going off the screen
      scrollLeft = scrollLeft - viewportLeftMarginPixels;
      width = width + viewportLeftMarginPixels;

      const earliest = baselineLeftmostDate.value;
      const leftDate = earliest.plus({
        [diffScale]: (scrollLeft / pageScale.value) * 24,
      });
      const rightDate = earliest.plus({
        [diffScale]: ((scrollLeft + width) / pageScale.value) * 24,
      });
      return { from: leftDate, to: rightDate };
    };
  });
  const scalelessDistanceBetweenDates = (a: DateTime, b: DateTime) =>
    b.diff(a).as(diffScale);

  const distanceBetweenDates = computed(
    () => (a: DateTime, b: DateTime) =>
      (b.diff(a).as(diffScale) * pageScale.value) / 24
  );
  const scalelessDistanceFromBaselineLeftmostDate = computed(
    () => (a: DateTime) => a.diff(baselineLeftmostDate.value).as(diffScale)
  );
  const distanceFromBaselineLeftmostDate = computed(
    () => (a: DateTime) =>
      (a.diff(baselineLeftmostDate.value).as(diffScale) * pageScale.value) / 24
  );
  const distanceBetweenBaselineDates = computed(() =>
    distanceFromBaselineLeftmostDate.value(baselineRightmostDate.value)
  );
  const distanceFromViewportLeftDate = (a: DateTime) =>
    (a.diff(pageSettings.value.viewportDateInterval.from).as(diffScale) *
      pageScale.value) /
    24;

  const scaleToGetDistance = (distance: number, range: DateRange) =>
    (distance * 24) / range.toDateTime.diff(range.fromDateTime).as(diffScale);

  const dateFromClientLeft = computed(
    () => (offset: number) =>
      baselineLeftmostDate.value.plus({
        [diffScale]:
          ((offset + pageSettings.value.viewport.left) / pageScale.value) * 24,
      })
  );

  const setViewport = (viewport: Viewport) => {
    pageSettings.value.viewport = viewport;
    pageSettings.value.viewportDateInterval = dateIntervalFromViewport.value(
      viewport.left,
      viewport.width
    );
  };
  const setMode = (m: TimelineMode) => {
    mode.value = m;
  };
  const setViewportGetter = (getter: () => Viewport) => {
    viewportGetter.value = getter;
  };
  const setPageScale = (s: number) => {
    // TODO: also limit zooming in based on our position, if it would put us
    // past the browser's limit of a div's width
    const scale = Math.min(
      scaleToGetDistance(17_895_697, {
        fromDateTime: baselineLeftmostDate.value,
        toDateTime: baselineRightmostDate.value,
      }),
      Math.max(MIN_SCALE, Math.min(MAX_SCALE, s))
    );
    pageSettings.value.scale = scale;
    return s === scale;
  };
  const setStartedWidthChange = (started: boolean) => {
    startedWidthChange.value = started;
  };
  const setHideNowLine = (hide: boolean) => {
    hideNowLine.value = hide;
  };
  const setScrollToPaths = (ep?: EventPaths) => {
    scrollToPath.value = ep;
  };
  const setShowingJumpToRange = (show: boolean) => {
    showingJumpToRange.value = show;
  };
  const setJumpToRange = (range: DateRangePart) => {
    jumpToRange.value = range;
  };
  const setShouldZoomWhenScrolling = (should: boolean) => {
    shouldZoomWhenScrolling.value = should;
  };
  const collapse = (path: Path) => {
    collapsed.add(path.join(","));
  };
  const expand = (path: Path) => {
    collapsed.delete(path.join(","));
  };
  const toggleCollapsed = (path: Path) => {
    const pathJoined = path.join(",");
    if (collapsed.has(pathJoined)) {
      collapsed.delete(pathJoined);
    } else {
      collapsed.add(pathJoined);
    }
  };
  const setCollapsed = (path: Path | string, shouldCollapse: boolean) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    if (shouldCollapse) {
      collapsed.add(pathJoined);
    } else {
      collapsed.delete(pathJoined);
    }
  };
  const isCollapsed = (path: Path | string) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    for (const entry of collapsed.keys()) {
      if (pathJoined.startsWith(entry)) {
        return true;
      }
    }
    return false;
  };
  const isCollapsedChild = (path: Path | string) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    for (const entry of collapsed.keys()) {
      if (pathJoined !== entry && pathJoined.startsWith(entry)) {
        return true;
      }
    }
    return false;
  };

  const weights = computed(() => {
    const arbitraryNumber = 2000;
    const secondsInADay = 86400;

    const to = pageSettings.value.viewportDateInterval.to;
    const from = pageSettings.value.viewportDateInterval.from;

    const rawDiff = to.diff(from).as(diffScale);

    const multiplier = arbitraryNumber * secondsInADay;
    const diff = rawDiff * (multiplier / 24);

    const width = pageSettings.value.viewport.width;
    const denom = diff / width;
    return [
      clamp(roundToTwoDecimalPlaces((30 * SECOND) / denom)),
      clamp(roundToTwoDecimalPlaces((20 * QUARTER_MINUTE) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * MINUTE) / denom)),
      clamp(roundToTwoDecimalPlaces((20 * QUARTER_HOUR) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * HOUR) / denom)),
      clamp(roundToTwoDecimalPlaces((40 * DAY) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * MONTH) / denom)),
      clamp(roundToTwoDecimalPlaces((25 * YEAR) / denom)),
      clamp(roundToTwoDecimalPlaces((10 * DECADE) / denom)),
    ];
  });

  const scaleOfViewportDateInterval = computed(() => {
    for (let i = 0; i < weights.value.length; i++) {
      if (weights.value[i] > timeMarkerWeightMinimum) {
        return scales[i];
      }
    }
    return "decade";
  });

  return {
    // state
    pageSettings,
    startedWidthChange,
    hideNowLine,
    scrollToPath,
    showingJumpToRange,
    jumpToRange,
    shouldZoomWhenScrolling,
    collapsed,
    mode,

    // getters
    pageTimelineMetadata,
    pageScale,
    pageScaleBy24: computed(() => pageScale.value / 24),
    baselineLeftmostDate,
    baselineRightmostDate,
    scalelessDistanceBetweenDates,
    distanceBetweenDates: distanceBetweenDates as unknown as (
      a: DateTime,
      b: DateTime
    ) => number,
    distanceFromViewportLeftDate,
    distanceFromBaselineLeftmostDate:
      distanceFromBaselineLeftmostDate as unknown as (a: DateTime) => number,
    distanceBetweenBaselineDates,
    dateFromClientLeft: dateFromClientLeft as unknown as (
      offset: number
    ) => DateTime,
    scaleToGetDistance,
    scalelessDistanceFromBaselineLeftmostDate,
    isCollapsed,
    isCollapsedChild,
    scaleOfViewportDateInterval,
    weights,

    // actions
    setViewport,
    setViewportGetter,
    setPageScale,
    setStartedWidthChange,
    setHideNowLine,
    setScrollToPaths,
    setShowingJumpToRange,
    setJumpToRange,
    setShouldZoomWhenScrolling,
    collapse,
    setCollapsed,
    toggleCollapsed,
    expand,
    setMode,
  };
});
