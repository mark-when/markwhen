import { defineStore } from "pinia";
import type { DateTime } from "luxon";
import { useTimelineStore } from "../timelineStore";
import {
  ceilDateTime,
  diffScale,
  floorDateTime,
  scales,
  type DateInterval,
  type DisplayScale,
  type OffsetRange,
} from "../utilities/dateTimeUtilities";

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

function roundToTwoDecimalPlaces(n: number): number {
  return Math.floor(n * 100) / 100;
}

export function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(max, Math.max(value, min));
}

export const useMarkersStore = defineStore({
  id: "markerStore",
  state: () => ({
    hoveringMarker: null as TimeMarker | null,
    range: undefined as OffsetRange | undefined
  }),
  getters: {
    markers(state): TimeMarker[] {
      const timelineStore = useTimelineStore();

      const markers = [] as TimeMarker[];
      const scale = this.scaleOfViewportDateInterval as DisplayScale;
      const { from: leftViewportDate, to: rightViewportDate } = timelineStore
        .pageSettings.viewportDateInterval as DateInterval;

      let nextLeft = ceilDateTime(leftViewportDate, scale);
      let rightmost = ceilDateTime(rightViewportDate, scale);

      markers.push({
        dateTime: leftViewportDate,
        size: timelineStore.scalelessDistanceBetweenDates(leftViewportDate, nextLeft),
        ts: leftViewportDate.toMillis(),
      });

      // 256 is an arbitrary number
      while (nextLeft < rightmost && markers.length < 256) {
        markers.push({
          dateTime: nextLeft,
          size: 0,
          ts: nextLeft.toMillis(),
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
        markers[markers.length - 1].size = timelineStore.scalelessDistanceBetweenDates(
          markers[markers.length - 1].dateTime,
          nextLeft
        );
      }

      // Get the last one
      markers[markers.length - 1].size = timelineStore.scalelessDistanceBetweenDates(
        markers[markers.length - 1].dateTime,
        rightmost
      );
      return markers;
    },
    weights(state): TimeMarkerWeights {
      const timelineStore = useTimelineStore();
      const arbitraryNumber = 2000;
      const secondsInADay = 86400;

      const to = timelineStore.pageSettings.viewportDateInterval.to;
      const from = timelineStore.pageSettings.viewportDateInterval.from;

      const rawDiff = to.diff(from).as(diffScale);

      const multiplier = arbitraryNumber * secondsInADay;
      const diff = rawDiff * (multiplier / 24);

      const width = timelineStore.pageSettings.viewport.width;
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
    },
    scaleOfViewportDateInterval(state): DisplayScale {
      const weights = this.weights;
      for (let i = 0; i < weights.length; i++) {
        if (weights[i] > timeMarkerWeightMinimum) {
          return scales[i];
        }
      }
      return "decade";
    },
    rangeFromOffsetLeft(state): (offset: number) => OffsetRange {
      const timelineStore = useTimelineStore();
      return (offset: number) => {
        const offsetDate = timelineStore.dateFromClientLeft(offset);
        const scale = this.scaleOfViewportDateInterval as DisplayScale;
        const floored = floorDateTime(offsetDate, scale);
        const ceiled = ceilDateTime(offsetDate, scale);
        return [
          {
            dateTime: floored,
            left: timelineStore.distanceFromBaselineLeftmostDate(floored),
          },
          {
            dateTime: ceiled,
            left: timelineStore.distanceFromBaselineLeftmostDate(ceiled),
          },
        ];
      };
    },
    nextMostGranularScaleOfViewportDateInterval(): DisplayScale {
      const weights = this.weights;
      for (let i = 0; i < weights.length; i++) {
        if (weights[i] > 0.05) {
          return scales[i];
        }
      }
      return "decade";
    },
  },
  actions: {
    setHoveringMarker(marker: TimeMarker | undefined) {
      this.hoveringMarker = marker || null;
    },
    setRange(range?: OffsetRange) {
      this.range = range
    }
  },
});
