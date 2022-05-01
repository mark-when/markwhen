import { Context } from "@nuxt/types";
import {
  parse,
  AMERICAN_DATE_FORMAT,
  EUROPEAN_DATE_FORMAT,
  DateFormat,
  PAGE_BREAK,
  sorts,
} from "~/src/Parser";
import sortEvents, { EventSubGroup, Sort } from "~/src/Sort";
import {
  Cascade,
  CascadeMetadata,
  DateRange,
  Event,
  Events,
  Range,
  Tags,
} from "../src/Types";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import { DateTime } from "luxon";
import { exampleTimeline } from "./exampleTimeline";

interface State {
  list: string[];
  currentTimelineName: string;
  settings: Settings[];
  startedWidthChange: boolean;
  eventsString: string | undefined;
  timelinePath: string | null;
  username: string | null;
  hasSeenHowTo: boolean;
  editable: boolean;
  globalClass: string;
  cascadeIndex: number;
}

interface DateInterval {
  from: DateTime;
  to: DateTime;
}

export interface TimeMarker {
  ts: number;
  dateTime: DateTime;
  size: number;
  left: number;
}

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 3000;
const initialScale = 0.3;

export const viewportLeftMarginPixels = 64;
export const timeMarkerWeightMinimum = 0.25;

let currentTimelineName = "";
let list = [] as string[];

const eventsString = currentTimelineName
  ? localStorage.getItem(currentTimelineName)
  : "";

export interface Settings {
  scale: number;
  viewportDateInterval: DateInterval;
  viewport: Viewport;
  sort: Sort;
  filter: string[];
}

export const state: () => State = () => ({
  list: list,
  currentTimelineName: currentTimelineName,
  settings: [blankSettings()],
  startedWidthChange: false,
  filter: [],
  eventsString: eventsString || undefined,
  timelinePath: "",
  username: "",
  hasSeenHowTo: true,
  editable: true,
  globalClass: "",
  cascadeIndex: 0,
});

export type DisplayScale =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "decade";

export const scales: DisplayScale[] = [
  "second",
  "minute",
  "hour",
  "day",
  "month",
  "year",
  "decade",
];

export type TimeMarkerWeights = [
  number /* second */,
  number /* minute */,
  number /* hour */,
  number /* day */,
  number /* month */,
  number /* year */,
  number /* decade */
];

interface Viewport {
  left: number;
  width: number;
  top: number;
}

const diffScale = "days";

const SECOND = 1;
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;
const DECADE = 10 * YEAR;

export const MUTATION_SET_EVENTS_STRING = "setEventsString";

function blankSettings(): Settings {
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

export const mutations: MutationTree<State> = {
  setCascadeIndex(state: State, index: number) {
    let newSettings = false;
    for (let i = 0; i <= index; i++) {
      if (!state.settings[i]) {
        newSettings = true;
        state.settings[i] = blankSettings();
      }
    }
    if (newSettings) {
      state.settings = [...state.settings];
      console.log("settings after", state.settings);
    }
    state.cascadeIndex = index;
  },
  setSettings(state: State, settings: Settings[]) {
    state.settings = settings;
  },
  removeSettings(state: State, index: number) {
    state.settings.splice(index, 1);
  },
  seteditable(state: State, editable: boolean) {
    state.editable = editable;
  },
  setGlobalClass(state: State, globalClass: string) {
    state.globalClass = globalClass;
  },
  clearGlobalClass(state: State) {
    state.globalClass = "";
  },
  setStartedWidthChange(state: State, changing: boolean) {
    state.startedWidthChange = changing;
  },
  setUsername(state: State, username: string) {
    state.username = username;
  },
  setTimelinePath(state: State, path: string) {
    state.timelinePath = path;
  },
  setSort(state: State, sort: Sort) {
    state.settings[state.cascadeIndex].sort = sort;
  },
  toggleSort(state: State, sort: Sort) {
    state.settings[state.cascadeIndex].sort =
      sorts[
        (sorts.indexOf(state.settings[state.cascadeIndex].sort) + 1) %
          sorts.length
      ];
  },
  setHasSeenHowTo(state: State, hasSeen: boolean) {
    state.hasSeenHowTo = hasSeen;
    if (!process.browser) {
      return;
    }
    if (hasSeen) {
      localStorage.setItem("hasSeenHowTo", "true");
    } else {
      localStorage.removeItem("hasSeenHowTo");
    }
  },
  checkHasSeenHowTo(state: State) {
    if (!process.browser) {
      return;
    }
    state.hasSeenHowTo = !!localStorage.getItem("hasSeenHowTo");
  },
  getLocalTimelines(state: State) {
    if (!process.browser || state.timelinePath) {
      return;
    }
    const concatenatedList =
      window && window.localStorage && window.localStorage.getItem("timelines");
    state.list = concatenatedList ? concatenatedList.split(",") : [];
    state.currentTimelineName = state.list.length > 0 ? state.list[0] : "";
    const draft = localStorage.getItem("__draft");
    if (draft) {
      state.eventsString = draft;
    } else {
      state.eventsString =
        (state.currentTimelineName
          ? localStorage.getItem(state.currentTimelineName)
          : exampleTimeline) || undefined;
    }
  },
  setCurrentTimeline(state: State, timelineName: string) {
    state.eventsString = localStorage.getItem(timelineName) ?? "";
    state.currentTimelineName = timelineName;
  },
  removeTimeline(state: State, timelineName: string) {
    localStorage.removeItem(timelineName);
    state.list.splice(state.list.indexOf(timelineName), 1);
    localStorage.setItem("timelines", state.list.join(","));
    if (state.currentTimelineName === timelineName && state.list.length > 0) {
      const nextTimeline = state.list[0];
      state.eventsString = localStorage.getItem(nextTimeline) || "";
    } else {
      state.eventsString = "";
    }
  },
  saveTimeline(state: State, timelineName: string) {
    localStorage.setItem(timelineName, state.eventsString || "");
    if (!state.list.includes(timelineName)) {
      state.list.push(timelineName);
      localStorage.setItem("timelines", state.list.join(","));
    }
  },
  setScale(state: State, width: number) {
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, width));
    state.settings[state.cascadeIndex].scale = scale;
  },
  setEventsString(state: State, str: string) {
    // console.log("setting events string");
    state.eventsString = str;
    if (process.browser) {
      localStorage.setItem("__draft", str);
    }
  },
  clearFilters(state: State) {
    state.settings[state.cascadeIndex].filter = [];
  },
  filterTag(state: State, tag: string) {
    const index = state.settings[state.cascadeIndex].filter.indexOf(tag);
    if (index >= 0) {
      state.settings[state.cascadeIndex].filter.splice(index, 1);
    } else {
      state.settings[state.cascadeIndex].filter.push(tag);
    }
  },
  setViewportDateInterval(state: State, interval: DateInterval) {
    state.settings[state.cascadeIndex].viewportDateInterval = interval;
  },
  setViewport(state: State, viewport: Viewport) {
    state.settings[state.cascadeIndex].viewport = viewport;
  },
};

export function roundDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const up = ceilDateTime(dateTime, toScale);
  const down = floorDateTime(dateTime, toScale);
  const upDiff = dateTime.diff(up);
  const downDiff = dateTime.diff(down);
  return Math.abs(+upDiff) < Math.abs(+downDiff) ? up : down;
}

function ceilDateTime(dateTime: DateTime, toScale: DisplayScale) {
  let increment;
  if (toScale === "decade") {
    increment = { years: 10 };
  } else {
    increment = { [toScale]: 1 };
  }
  return floorDateTime(dateTime, toScale).plus(increment);
}

function floorDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const year = dateTime.year;
  if (toScale === "decade") {
    const roundedYear = year - (year % 10);
    return DateTime.fromObject({ year: roundedYear });
  }
  if (toScale === "year") {
    return DateTime.fromObject({ year });
  }
  const month = dateTime.month;
  if (toScale === "month") {
    return DateTime.fromObject({ year, month });
  }
  const day = dateTime.day;
  if (toScale === "day") {
    return DateTime.fromObject({ year, month, day });
  }
  const hour = dateTime.hour;
  if (toScale === "hour") {
    return DateTime.fromObject({ year, month, day, hour });
  }
  const minute = dateTime.minute;
  if (toScale === "minute") {
    return DateTime.fromObject({ year, month, day, hour, minute });
  }
  const second = dateTime.second;
  return DateTime.fromObject({ year, month, day, hour, minute, second });
}

function roundToTwoDecimalPlaces(n: number): number {
  return Math.floor(n * 100) / 100;
}

export function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(max, Math.max(value, min));
}
export const getters: GetterTree<State, State> = {
  cascades(state: State, getters: any): Cascade[] {
    return parse(state.eventsString).cascades;
  },
  cascade(state: State, getters: any): Cascade {
    return getters.cascades[state.cascadeIndex];
  },
  cascadeString(state: State, getters: any): string {
    const cascade = getters.cascade as Cascade;
    return (
      state.eventsString?.slice(
        cascade.metadata.startStringIndex,
        cascade.metadata.endStringIndex
      ) || ""
    );
  },
  ranges(state: State, getters: any): Range[] {
    return getters.cascade.ranges;
  },
  settings(state: State, getters: any): Settings {
    return state.settings[state.cascadeIndex];
  },
  events(state: State, getters: any): Events {
    const sorted = sortEvents(
      [...getters.cascade.events],
      getters.settings.sort
    );
    return sorted;
  },
  filteredEvents(state: State, getters: any): Events {
    const events = getters.events as Events;
    const filter = state.settings[state.cascadeIndex].filter;
    if (filter.length === 0) {
      return events;
    }

    const filtered = [];
    for (const eventOrEvents of events) {
      if (eventOrEvents instanceof Event) {
        if (eventOrEvents.event.tags.some((tag) => filter.includes(tag))) {
          filtered.push(eventOrEvents);
        }
      } else {
        const group = eventOrEvents as EventSubGroup;
        if (group.tags?.some((tag) => filter.includes(tag))) {
          filtered.push(group);
        } else {
          const filteredSubEvents: EventSubGroup = group.filter((event) =>
            event.event.tags.some((tag) => filter.includes(tag))
          );
          if (filteredSubEvents.length) {
            filteredSubEvents.range = group.range;
            filteredSubEvents.tags = group.tags;
            filteredSubEvents.title = group.title;
            filteredSubEvents.startExpanded = group.startExpanded;
            filteredSubEvents.style = group.style;
            filtered.push(filteredSubEvents);
          }
        }
      }
    }
    sortEvents(filtered, getters.settings.sort);
    return filtered;
  },
  tags(state: State, getters: any): Tags {
    return getters.cascade.tags;
  },
  metadata(state: State, getters: any): CascadeMetadata {
    return getters.cascade.metadata;
  },
  dateFromOffsetLeft(state: State, getters: any) {
    return (offset: number) => {
      const leftDate = getters.baselineLeftmostDate.plus({
        [diffScale]: getters.settings.viewport.left / getters.settings.scale,
      });
      return leftDate.plus({
        days: offset / getters.settings.scale,
      });
    };
  },
  distanceBetweenDates(state: State, getters: any) {
    return (a: DateTime, b: DateTime) =>
      b.diff(a).as(diffScale) * getters.settings.scale;
  },
  baselineLeftmostDate(state: State, getters: any) {
    const metadata = getters.metadata as CascadeMetadata;
    const earliestTime = metadata.earliestTime;
    const days = metadata.maxDuration.as("days");
    if (days < 1) {
      return floorDateTime(earliestTime.minus({ days: 1 }), "day");
    }
    if (days < 30) {
      return floorDateTime(earliestTime.minus({ months: 4 }), "year");
    }
    if (days < 180) {
      return floorDateTime(earliestTime.minus({ months: 6 }), "year");
    }
    return floorDateTime(earliestTime.minus({ days }), "year");
  },
  baselineRightmostDate(state: State, getters: any) {
    return floorDateTime(
      (getters.metadata as CascadeMetadata).latestTime.plus({ years: 30 }),
      "year"
    );
  },
  distanceBetweenBaselineDates(state: State, getters: any) {
    return getters.distanceFromBaselineLeftmostDate(
      getters.baselineRightmostDate
    );
  },
  distanceFromBaselineLeftmostDate(state: State, getters: any) {
    return (a: DateTime) =>
      a.diff(getters.baselineLeftmostDate).as(diffScale) *
      getters.settings.scale;
  },
  viewportDateInterval(state: State, getters: any): DateInterval {
    if (
      typeof getters.settings.viewportDateInterval.from === "string" &&
      typeof getters.settings.viewportDateInterval.to === "string"
    ) {
      return {
        from: DateTime.fromISO(getters.settings.viewportDateInterval.from),
        to: DateTime.fromISO(getters.settings.viewportDateInterval.to),
      };
    }
    return getters.settings.viewportDateInterval;
  },
  setDateIntervalFromViewport(
    state: State,
    getters: any
  ): (scrollLeft: number, width: number) => DateInterval {
    return (scrollLeft: number, width: number) => {
      // We're adding these so that when we are scrolling it looks like the left
      // time markers are going off the screen
      scrollLeft = scrollLeft - viewportLeftMarginPixels;
      width = width + viewportLeftMarginPixels;

      const earliest = getters.baselineLeftmostDate;
      const leftDate = earliest.plus({
        [diffScale]: scrollLeft / getters.settings.scale,
      });
      const rightDate = earliest.plus({
        [diffScale]: (scrollLeft + width) / getters.settings.scale,
      });
      return { from: leftDate, to: rightDate };
    };
  },
  timeMarkerWeights(state: State, getters: any): TimeMarkerWeights {
    const diff = getters.viewportDateInterval.to
      .diff(getters.viewportDateInterval.from)
      .as("seconds");
    const width = getters.settings.viewport.width;
    const denom = diff / (width / 2000);
    return [
      clamp(roundToTwoDecimalPlaces((30 * SECOND) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * MINUTE) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * HOUR) / denom)),
      clamp(roundToTwoDecimalPlaces((40 * DAY) / denom)),
      clamp(roundToTwoDecimalPlaces((30 * MONTH) / denom)),
      clamp(roundToTwoDecimalPlaces((25 * YEAR) / denom)),
      clamp(roundToTwoDecimalPlaces((10 * DECADE) / denom)),
    ];
  },
  nextMostGranularScaleOfViewportDateInterval(
    state: State,
    getters: any
  ): DisplayScale {
    const weights = getters.timeMarkerWeights;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > 0.05) {
        return scales[i];
      }
    }
    return "decade";
  },
  scaleOfViewportDateInterval(state: State, getters: any): DisplayScale {
    const weights = getters.timeMarkerWeights;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > timeMarkerWeightMinimum) {
        return scales[i];
      }
    }
    return "decade";
  },
  timeMarkers(state: State, getters: any): TimeMarker[] {
    const markers = [] as TimeMarker[];
    const scale = getters.scaleOfViewportDateInterval as DisplayScale;
    const {
      from: leftViewportDate,
      to: rightViewportDate,
    } = getters.viewportDateInterval as DateInterval;

    let nextLeft = ceilDateTime(leftViewportDate, scale);
    let rightmost = ceilDateTime(rightViewportDate, scale);

    markers.push({
      dateTime: leftViewportDate,
      size: getters.distanceBetweenDates(leftViewportDate, nextLeft),
      left: getters.distanceBetweenDates(leftViewportDate, nextLeft),
      ts: leftViewportDate.toMillis(),
    });

    // 256 is an arbitrary number
    while (nextLeft < rightmost && markers.length < 256) {
      markers.push({
        dateTime: nextLeft,
        size: 0,
        ts: nextLeft.toMillis(),
        left: getters.distanceBetweenDates(leftViewportDate, nextLeft),
      });
      if (scale === "decade") {
        nextLeft = nextLeft.plus({ years: 10 });
      } else {
        nextLeft = nextLeft.plus({ [scale]: 1 });
      }
      markers[markers.length - 1].size = getters.distanceBetweenDates(
        markers[markers.length - 1].dateTime,
        nextLeft
      );
    }

    // Get the last one
    markers[markers.length - 1].size = getters.distanceBetweenDates(
      markers[markers.length - 1].dateTime,
      rightmost
    );
    // console.log('scale:', scale)
    // console.log('from', leftViewportDate.toLocaleString(), 'to', rightViewportDate.toLocaleString())
    // console.log('num markers:', markers.length)
    // console.log('leftmost marker', m(markers[0]))
    // console.log('rightmost marker', m(markers[markers.length - 1]))
    // console.log('')
    return markers;
  },
};

export function dateScale(dateTime: DateTime) {
  if (dateTime.second === 0) {
    if (dateTime.minute === 0) {
      if (dateTime.hour === 0) {
        if (dateTime.day === 1) {
          if (dateTime.month === 1) {
            if (dateTime.year % 10 === 0) {
              return 6;
            }
            return 5;
          }
          return 4;
        }
        return 3;
      }
      return 2;
    }
    return 1;
  }
  return 0;
}

function dateRangeToString(
  range: DateRange,
  scale: DisplayScale,
  dateFormat: DateFormat
) {
  const fromAsString = dateTimeToString(
    range.fromDateTime,
    scale,
    true,
    dateFormat
  );
  const toAsString = dateTimeToString(
    range.toDateTime,
    scale,
    false,
    dateFormat
  );
  if (fromAsString === toAsString) {
    return `${fromAsString}`;
  }
  return `${fromAsString} - ${toAsString}`;
}

function isDayStartOrEnd(dateTime: DateTime, scale: DisplayScale) {
  if (!["month", "day"].includes(scale)) {
    return false;
  }
  return [23, 0, 1].includes(dateTime.hour);
}

function isMonthStartOrEnd(dateTime: DateTime, scale: DisplayScale) {
  if (!["decade", "year", "month"].includes(scale)) {
    return false;
  }
  return [28, 29, 30, 31, 1, 2].includes(dateTime.day);
}

function isYearStartOrEnd(dateTime: DateTime, scale: DisplayScale): boolean {
  if (!["decade", "year", "month"].includes(scale)) {
    return false;
  }
  if (dateTime.month === 12 && (dateTime.day === 31 || dateTime.day === 30)) {
    return true;
  }
  if (dateTime.month === 1 && (dateTime.day === 1 || dateTime.day === 2)) {
    return true;
  }
  return false;
}

function dateTimeToString(
  dateTime: DateTime,
  scale: DisplayScale,
  isStartDate: boolean,
  dateFormat: typeof AMERICAN_DATE_FORMAT | typeof EUROPEAN_DATE_FORMAT
): string {
  if (isYearStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const fromYear = dateTime.plus({ days: 2 }).year;
      return `${fromYear}`;
    } else {
      const toYear = dateTime.minus({ days: 2 }).year;
      return `${toYear}`;
    }
  }
  if (isMonthStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const adjustedForward = dateTime.plus({ days: 2 });
      return `${
        adjustedForward.month < 10
          ? "0" + adjustedForward.month
          : adjustedForward.month
      }/${adjustedForward.year}`;
    } else {
      const adjustedBack = dateTime.minus({ days: 2 });
      return `${
        adjustedBack.month < 10 ? "0" + adjustedBack.month : adjustedBack.month
      }/${adjustedBack.year}`;
    }
  }
  if (isDayStartOrEnd(dateTime, scale)) {
    if (isStartDate) {
      const adjustedForward = dateTime.plus({ hours: 2 });
      return dayFormat(adjustedForward, dateFormat);
    } else {
      const adjustedBack = dateTime.minus({ hours: 2 });
      return dayFormat(adjustedBack, dateFormat);
    }
  }
  return asIso(dateTime);
}

function dayFormat(dateTime: DateTime, dateFormat: DateFormat): string {
  const day = dateTime.day;
  const month = dateTime.month;
  const year = dateTime.year;
  if (dateFormat === AMERICAN_DATE_FORMAT) {
    return `${month}/${day}/${year}`;
  } else if (dateFormat === EUROPEAN_DATE_FORMAT) {
    return `${day}/${month}/${year}`;
  }
  return "unexpected date format";
}

function asIso(dateTime: DateTime): string {
  return dateTime.toUTC().toISO({ includeOffset: false }) + "Z";
}

function m(m: TimeMarker): string {
  return `${m.dateTime.toLocaleString()}, ${m.size}px`;
}

function getPreviousEvent(event: Event, events: Event[]) {
  for (let i = 0; i < events.length; i++) {
    const current = events[i];
    if (
      current.ranges.date.dateRangeInText === event.ranges.date.dateRangeInText
    ) {
      if (i > 0) {
        return events[i - 1];
      }
      return null;
    }
  }
  return null;
}

function getNextEvent(event: Event, events: Event[]) {
  for (let i = events.length - 1; i >= 0; i--) {
    const current = events[i];
    if (
      current.ranges.date.dateRangeInText === event.ranges.date.dateRangeInText
    ) {
      if (i < events.length - 1) {
        return events[i + 1];
      }
      return null;
    }
  }
  return null;
}

export const actions: ActionTree<State, State> = {
  nuxtServerInit(store: any, context: Context) {
    if (context.req.timelineFile) {
      store.commit(MUTATION_SET_EVENTS_STRING, context.req.timelineFile);
    }
    if (context.req.timelinePath) {
      store.commit("setTimelinePath", context.req.timelinePath);
    }
  },
  setViewport({ commit, getters }, viewport: Viewport) {
    const viewportInterval = getters.setDateIntervalFromViewport(
      viewport.left,
      viewport.width
    );
    commit("setViewport", viewport);
    commit("setViewportDateInterval", viewportInterval);
  },
  moveEventUpOrDown(
    { state, commit, getters },
    { up, event }: { up: boolean; event: Event }
  ) {
    const events = (getters.events as Events).flat();
    const es = state.eventsString;
    const swap = up
      ? getPreviousEvent(event, events)
      : getNextEvent(event, events);
    if (!swap || !es) {
      return;
    }

    const first = up ? swap : event;
    const second = up ? event : swap;

    const firstFullEventString = es.substring(
      first.ranges.event.from,
      first.ranges.event.to
    );
    const secondFullEventString = es.substring(
      second.ranges.event.from,
      second.ranges.event.to
    );

    const newString =
      es.substring(0, first.ranges.event.from) +
      secondFullEventString +
      es.substring(first.ranges.event.to, second.ranges.event.from) +
      firstFullEventString +
      es.substring(second.ranges.event.to, es.length);

    commit(MUTATION_SET_EVENTS_STRING, newString);
  },
  updateEventDateRange({ commit, state, getters }, params) {
    const { event, from, to } = params as {
      event: Event;
      from: DateTime;
      to: DateTime;
    };
    const range: DateRange = { fromDateTime: from, toDateTime: to };
    const inTextFrom = event.ranges.date.dateRangeInText.from;
    const inTextTo = event.ranges.date.dateRangeInText.to;
    const pre = state.eventsString?.slice(0, inTextFrom);
    const post = state.eventsString?.slice(inTextTo);
    const scale = getters.scaleOfViewportDateInterval;
    commit(
      MUTATION_SET_EVENTS_STRING,
      pre +
        `${dateRangeToString(range, scale, getters.metadata.dateFormat)}:` +
        post
    );
  },
  addNewPage({ commit, state, getters }) {
    const currentLength = getters.cascades.length;
    commit(
      MUTATION_SET_EVENTS_STRING,
      state.eventsString
        ?.concat(PAGE_BREAK)
        .concat(`title: Page ${currentLength + 1}`)
    );
    commit("setCascadeIndex", currentLength);
  },
  setCascadeString({ commit, state, getters }, cascadeString: string) {
    const currentCascade = getters.cascade as Cascade;
    const currentEventsString = state.eventsString || "";
    const pre = currentEventsString.substring(
      0,
      currentCascade.metadata.startStringIndex
    );
    const post = currentEventsString.substring(
      currentCascade.metadata.endStringIndex
    );
    const newEventsString = pre + cascadeString + post;
    commit(MUTATION_SET_EVENTS_STRING, newEventsString);
  },
  deletePage({ commit, state, getters }, index: number) {
    if (getters.cascades.length === 1) {
      commit(MUTATION_SET_EVENTS_STRING, "");
    }

    // If we're deleting the first page, we delete the
    // break after if, otherwise we delete the break before it
    const cascade = getters.cascades[index] as Cascade;
    const currentEventsString = state.eventsString || "";

    let startIndex = cascade.metadata.startStringIndex;
    let endIndex = cascade.metadata.endStringIndex;
    if (index === 0) {
      endIndex += PAGE_BREAK.length;
    } else {
      startIndex -= PAGE_BREAK.length;
    }

    // if we have settings for that page, delete them
    if (state.settings[index]) {
      commit("removeSettings", index);
    }

    // Also, if the page is before us, we need to decrement the index of the page we're on
    if (state.cascadeIndex === index && index === getters.cascades.length - 1) {
      commit("setCascadeIndex", state.cascadeIndex - 1);
    } else if (index < state.cascadeIndex) {
      commit("setCascadeIndex", state.cascadeIndex - 1);
    }
    commit(
      MUTATION_SET_EVENTS_STRING,
      currentEventsString.substring(0, startIndex) +
        currentEventsString.substring(endIndex)
    );
  },
  movePages({ commit, state, getters }, { from, to }) {
    if (from === to) {
      return;
    }
    // Just do it heavy-handedly
    const cascades = getters.cascades as Cascade[];
    const ces = state.eventsString || "";
    const sub = (from: number, to: number) => ces.substring(from, to);
    const order = newOrder(
      cascades.map((c, i) => i),
      from,
      to
    );

    const rearrangedSettings = order.map((i) => state.settings[i]);
    const newIndex = order.findIndex((i) => i === state.cascadeIndex);
    const newString = order
      .map((i) => {
        const metadata = cascades[i].metadata;
        const start = metadata.startStringIndex;
        const end = metadata.endStringIndex;
        return sub(start, end);
      })
      .join(PAGE_BREAK);
    commit(MUTATION_SET_EVENTS_STRING, newString);
    commit("setSettings", rearrangedSettings);
    console.log("setting settings to", rearrangedSettings);
    commit("setCascadeIndex", newIndex);
  },
};

function newOrder(order: number[], from: number, to: number) {
  if (from > to) {
    order.splice(from, 1);
    order.splice(to, 0, from);
  } else {
    order.splice(to + 1, 0, from);
    order.splice(from, 1);
  }
  return order;
}
