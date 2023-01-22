import { defineStore } from "pinia";
import type { DateTime } from "luxon";
import { useTimelineStore } from "../timelineStore";
import {
  ceilDateTime,
  diffScale,
  floorDateTime,
  scales,
  type DateInterval,
  type DateTimeAndOffset,
  type DisplayScale,
  type OffsetRange,
} from "../utilities/dateTimeUtilities";
import { computed, ref } from "vue";

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

export const timeMarkerWeightMinimum = 0.25;

export interface TimeMarker {
  ts: number;
  dateTime: DateTime;
  size: number;
  accumulated: number;
}

export type TimeMarkerWeights = [
  number /* second */,
  number /* quarterminute */,
  number /* minute */,
  number /* quarterhour */,
  number /* hour */,
  number /* day */,
  number /* month */,
  number /* year */,
  number /* decade */
];

export const useMarkersStore = defineStore("markers", () => {
  const timelineStore = useTimelineStore();

  const hoveringMarker = ref<TimeMarker>();
  const range = ref<OffsetRange>();

  const markers = computed(() => {
    const markers = [] as TimeMarker[];
    const scale = timelineStore.scaleOfViewportDateInterval;
    const { fromDateTime: leftViewportDate, toDateTime: rightViewportDate } =
      timelineStore.pageSettings.viewportDateInterval;

    let nextLeft = ceilDateTime(leftViewportDate, scale);
    let rightmost = ceilDateTime(rightViewportDate, scale);

    let acc = timelineStore.scalelessDistanceBetweenDates(
      leftViewportDate,
      nextLeft
    );

    markers.push({
      dateTime: leftViewportDate,
      size: acc,
      ts: leftViewportDate.toMillis(),
      accumulated: acc,
    });

    // 256 is an arbitrary number
    while (nextLeft < rightmost && markers.length < 256) {
      markers.push({
        dateTime: nextLeft,
        size: 0,
        ts: nextLeft.toMillis(),
        accumulated: acc,
      });
      if (scale === "decade") {
        nextLeft = nextLeft.plus({ years: 10 });
      } else if (scale === "quarterhour") {
        nextLeft = nextLeft.plus({ minutes: 15 });
      } else if (scale === "quarterminute") {
        nextLeft = nextLeft.plus({ seconds: 15 });
      } else {
        nextLeft = nextLeft.plus({ [scale]: 1 });
      }
      const size = timelineStore.scalelessDistanceBetweenDates(
        markers[markers.length - 1].dateTime,
        nextLeft
      );
      acc += size;
      markers[markers.length - 1].size = size;
      markers[markers.length - 1].accumulated = acc;
    }

    // Get the last one
    markers[markers.length - 1].size =
      timelineStore.scalelessDistanceBetweenDates(
        markers[markers.length - 1].dateTime,
        rightmost
      );
    return markers;
  });

  const rangeFromOffsetLeft = computed(() => (offset: number) => {
    const offsetDate = timelineStore.dateFromClientLeft(offset);

    const scale = timelineStore.scaleOfViewportDateInterval as DisplayScale;
    const floored = floorDateTime(offsetDate, scale);
    const ceiled = ceilDateTime(offsetDate, scale);
    return [
      {
        dateTime: floored,
        left:
          timelineStore.distanceFromBaselineLeftmostDate(floored) +
          timelineStore.leftInsetWidth,
      },
      {
        dateTime: ceiled,
        left:
          timelineStore.distanceFromBaselineLeftmostDate(ceiled) +
          timelineStore.leftInsetWidth,
      },
    ] as [DateTimeAndOffset, DateTimeAndOffset];
  });

  const nextMostGranularScaleOfViewportDateInterval = computed(() => {
    for (let i = 0; i < timelineStore.weights.length; i++) {
      if (timelineStore.weights[i] > 0.05) {
        return scales[i];
      }
    }
    return "decade";
  });

  const setHoveringMarker = (marker: TimeMarker | undefined) => {
    hoveringMarker.value = marker;
  };

  const setRange = (r?: OffsetRange) => {
    range.value = r;
  };

  return {
    hoveringMarker,
    range,

    markers,
    rangeFromOffsetLeft,
    nextMostGranularScaleOfViewportDateInterval,

    setHoveringMarker,
    setRange,
  };
});
