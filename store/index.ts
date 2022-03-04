import { Context } from "@nuxt/types";
import { parse, Sort } from "~/src/Parser";
import { Cascade, CascadeMetadata, Event, Tags } from "../src/Types"
import { MutationTree, GetterTree, ActionTree } from "vuex"
import { DateTime } from "luxon";
interface State {
  list: string[],
  currentTimelineName: string,
  settings: {
    startedWidthChange: boolean,
    scale: number
  },
  filter: string[]
  eventsString: string | undefined,
  timelinePath: string | null,
  username: string | null
  dirtyEditor: boolean,
  hasSeenHowTo: boolean,
  viewportDateInterval: DateInterval
  viewport: Viewport
  sort: Sort
}

interface DateInterval {
  from: DateTime
  to: DateTime
}

export interface TimeMarker {
  ts: number
  dateTime: DateTime
  size: number
  left: number
}

export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
export const MIN_SCALE = 0.1
export const MAX_SCALE = 3000
const initialScale = 0.3

export const viewportLeftMarginPixels = 64
export const timeMarkerWeightMinimum = 0.25

let currentTimelineName = ''
let list = [] as string[]

const exampleTimeline = `// Comments start with two slashes: \`//\`
// Tags start with a pound sign: \`#\`

// You can color tags
#Work: pink
#Education: #111

08/2008-05/2012: Psych degree #Education
02/2010-06/2012: Dispatcher #Work

// Add a shareable google photos link to display images. 
10/2010: Barn built across the street https://photos.app.goo.gl/Er9D81cdiE2tUwDZA
06/2011-08/2011: Westover Air Reserve Base https://photos.app.goo.gl/NZ5rnGS7vZTXHe7aA #Work

// 2013
03/15/2013-04/2015: China https://photos.app.goo.gl/4UEkw3EbUkUuNzKGA #Work

// 2014
07/2014: 4th of July in DC https://photos.app.goo.gl/d418j6GSkCD5LGmY8

// 2015
05/2015-08/2015: Summer classes so I can graduate in two years #Education
05/2015: James graduation
06/2015: Built desk
06/2015: Kim and Matt wedding
08/2015-05/2017: CS degree #Education

// 2016
05/22/2016-08/12/2016: Cardinal Health #Work
08/16/2016-08/27/2016: Italy

// 2017
05/2017-05/2018: Cladwell #Work
06/10/2017-06/17/2017: The Hague & Copenhagen

// 2018
07/21/2018-07/22/2018: Chicago
07/26/2018-07/31/2018: LA and Seattle (interviewing)
08/04/2018-08/14/2018: Mexico City
09/05/2018-09/11/2018: Hong Kong and Macau
09/19/2018-09/22/2018: Road trip to Seattle
10/01/2018-01/2021: [Google](https://www.google.com) #Work
12/28/2018-12/29/2018: Nemacolin and Fallingwater

// 2019
06/08/2019: Paula's wedding
07/04/2019: 4th of July in Seattle with siblings
08/23/2019-08/27/2019: SF and Bishop's Ranch
09/2019: Hawaii with Google
12/20/2019-12/22/2019: Train from Seattle to Chicago
12/2019: Christmas at home, Dad to hospital

// 2020
02/29/2020: Molly and Kaitlyn to Seattle (thus starting covid)
03/28/2020: James to Austin
05/24/2020: Sold the Impala
07/2020: Oregon & Crater Lake
08/2020: Mt. Rainier
08/2020: Oak Island
09/2020: Hurricane Ridge
9/2020: Trip to Coeur d'Alene
11/2020: Trip to Denver
12/2020: Reese
12/25/2020: Christmas in Blaine

// 2021
01/2021: qr.new featured on [Hacker News](https://news.ycombinator.com/item?id=25481772)
02/2021: Hawaii
02/01/2021-now: Working on [swink](https://sw.ink) full time #Work
05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)
06/05/2021-06/12/2021: Ohio and James's Party
08/11/2021-08/17/2021: Cincinnati https://photos.app.goo.gl/h5CfrZamP5Tw6yDn7`
const eventsString = currentTimelineName ? localStorage.getItem(currentTimelineName) : exampleTimeline

export const state: () => State = () => ({
  list: list,
  currentTimelineName: currentTimelineName,
  settings: {
    startedWidthChange: false,
    scale: initialScale
  },
  filter: [],
  eventsString: eventsString || undefined,
  timelinePath: '',
  username: '',
  dirtyEditor: false,
  hasSeenHowTo: true,
  dateFormatFull: 'M/d/y',
  viewportDateInterval: {
    from: DateTime.now().minus({ years: 10 }),
    to: DateTime.now().plus({ years: 10 })
  },
  viewport: { left: 0, width: 0 },
  sort: "none"
})

export type DisplayScale =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "decade"

export const scales: DisplayScale[] = ['second', 'minute', 'hour', 'day', 'month', 'year', 'decade']

export type TimeMarkerWeights = [
  number, /* second */
  number, /* minute */
  number, /* hour */
  number, /* day */
  number, /* month */
  number, /* year */
  number, /* decade */
]

interface Viewport {
  left: number
  width: number
}

const diffScale = "days"

const SECOND = 1
const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 12 * MONTH
const DECADE = 10 * YEAR

export const mutations: MutationTree<State> = {
  setStartedWidthChange(state: State, changing: boolean) {
    state.settings.startedWidthChange = changing
  },
  setUsername(state: State, username: string) {
    state.username = username
  },
  setTimelinePath(state: State, path: string) {
    state.timelinePath = path
  },
  setSort(state: State, sort: Sort) {
    state.sort = sort
  },
  setHasSeenHowTo(state: State, hasSeen: boolean) {
    state.hasSeenHowTo = hasSeen
    if (!process.browser) {
      return
    }
    if (hasSeen) {
      localStorage.setItem('hasSeenHowTo', 'true')
    } else {
      localStorage.removeItem('hasSeenHowTo')
    }
  },
  checkHasSeenHowTo(state: State) {
    if (!process.browser) {
      return
    }
    state.hasSeenHowTo = !!localStorage.getItem('hasSeenHowTo')
  },
  getLocalTimelines(state: State) {
    if (!process.browser || state.timelinePath) {
      return
    }
    const concatenatedList = window && window.localStorage && window.localStorage.getItem("timelines")
    state.list = concatenatedList ? concatenatedList.split(',') : []
    state.currentTimelineName = state.list.length > 0 ? state.list[0] : ''
    state.eventsString = (state.currentTimelineName ? localStorage.getItem(state.currentTimelineName) : exampleTimeline) || undefined
  },
  setCurrentTimeline(state: State, timelineName: string) {
    state.eventsString = localStorage.getItem(timelineName) ?? ""
    state.currentTimelineName = timelineName
  },
  removeTimeline(state: State, timelineName: string) {
    localStorage.removeItem(timelineName);
    state.list.splice(state.list.indexOf(timelineName), 1);
    localStorage.setItem("timelines", state.list.join(","));
    if (state.currentTimelineName === timelineName && state.list.length > 0) {
      const nextTimeline = state.list[0]
      state.eventsString = localStorage.getItem(nextTimeline) || ""
    } else {
      state.eventsString = ""
    }
  },
  saveTimeline(state: State, timelineName: string) {
    localStorage.setItem(timelineName, state.eventsString || "");
    if (!state.list.includes(timelineName)) {
      state.list.push(timelineName)
      localStorage.setItem("timelines", state.list.join(","));
    }
  },
  setScale(state: State, width: number) {
    state.settings.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, width))
  },
  setEventsString(state: State, str: string) {
    state.eventsString = str
  },
  setDirtyEditor(state: State, dirty: boolean) {
    state.dirtyEditor = dirty
  },
  clearFilters(state: State) {
    state.filter = []
  },
  filterTag(state: State, tag: string) {
    const index = state.filter.indexOf(tag)
    if (index >= 0) {
      state.filter.splice(index, 1)
    } else {
      state.filter.push(tag)
    }
  },
  setViewportDateInterval(state: State, interval: DateInterval) {
    state.viewportDateInterval = interval
  },
  setViewport(state: State, viewport: Viewport) {
    state.viewport = viewport
  }
}

function ceilDateTime(dateTime: DateTime, toScale: DisplayScale) {
  let increment
  if (toScale === 'decade') {
    increment = { years: 10 }
  } else {
    increment = { [toScale]: 1 }
  }
  return floorDateTime(dateTime, toScale).plus(increment)
}

function floorDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const year = dateTime.year
  if (toScale === 'decade') {
    const roundedYear = year - year % 10
    return DateTime.fromObject({ year: roundedYear })
  }
  if (toScale === 'year') {
    return DateTime.fromObject({ year })
  }
  const month = dateTime.month
  if (toScale === 'month') {
    return DateTime.fromObject({ year, month })
  }
  const day = dateTime.day
  if (toScale === 'day') {
    return DateTime.fromObject({ year, month, day })
  }
  const hour = dateTime.hour
  if (toScale === 'hour') {
    return DateTime.fromObject({ year, month, day, hour })
  }
  const minute = dateTime.minute
  if (toScale === 'minute') {
    return DateTime.fromObject({ year, month, day, hour, minute })
  }
  const second = dateTime.second
  return DateTime.fromObject({ year, month, day, hour, minute, second })
}

function roundToTwoDecimalPlaces(n: number): number {
  return Math.floor(n * 100) / 100
}

export function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(max, Math.max(value, min))
}

export const getters: GetterTree<State, State> = {
  cascade(state: State, getters: any): Cascade {
    const cascade = parse(state.eventsString, state.sort)
    return cascade
  },
  events(state: State, getters: any): Event[] {
    return getters.cascade.events
  },
  filteredEvents(state: State, getters: any): Event[] {
    return (getters.events as Event[])
      .filter(event =>
        state.filter.length === 0 ||
        event.event.tags.some(tag =>
          state.filter.includes(tag)))
  },
  tags(state: State, getters: any): Tags {
    return getters.cascade.tags
  },
  metadata(state: State, getters: any): CascadeMetadata {
    return getters.cascade.metadata
  },
  distanceBetweenDates(state: State, getters: any) {
    return (a: DateTime, b: DateTime) => (b.diff(a).as(diffScale) * state.settings.scale)
  },
  baselineLeftmostDate(state: State, getters: any) {
    return floorDateTime((getters.metadata as CascadeMetadata).earliestTime.minus({ years: 1 }), 'year')
  },
  baselineRightmostDate(state: State, getters: any) {
    return floorDateTime((getters.metadata as CascadeMetadata).latestTime.plus({ years: 30 }), 'year')
  },
  distanceBetweenBaselineDates(state: State, getters: any) {
    return getters.distanceFromBaselineLeftmostDate(getters.baselineRightmostDate)
  },
  distanceFromBaselineLeftmostDate(state: State, getters: any) {
    return (a: DateTime) => (a.diff(getters.baselineLeftmostDate).as(diffScale) * state.settings.scale)
  },
  viewportDateInterval(state: State, getters: any): DateInterval {
    if (typeof state.viewportDateInterval.from === 'string' && typeof state.viewportDateInterval.to === 'string') {
      return {
        from: DateTime.fromISO(state.viewportDateInterval.from),
        to: DateTime.fromISO(state.viewportDateInterval.to)
      }
    }
    return state.viewportDateInterval
  },
  setDateIntervalFromViewport(state: State, getters: any): (scrollLeft: number, width: number) => DateInterval {
    return (scrollLeft: number, width: number) => {
      // We're adding these so that when we are scrolling it looks like the left 
      // time markers are going off the screen
      scrollLeft = scrollLeft - viewportLeftMarginPixels
      width = width + viewportLeftMarginPixels

      const earliest = getters.baselineLeftmostDate
      const leftDate = earliest.plus({ [diffScale]: scrollLeft / state.settings.scale })
      const rightDate = earliest.plus({ [diffScale]: (scrollLeft + width) / state.settings.scale })
      return { from: leftDate, to: rightDate }
    }
  },
  timeMarkerWeights(state: State, getters: any): TimeMarkerWeights {
    const diff = getters.viewportDateInterval.to.diff(getters.viewportDateInterval.from).as("seconds")
    const width = state.viewport.width
    const denom = diff / (width / 2000)
    return [
      clamp(roundToTwoDecimalPlaces(30 * SECOND / denom)),
      clamp(roundToTwoDecimalPlaces(30 * MINUTE / denom)),
      clamp(roundToTwoDecimalPlaces(25 * HOUR / denom)),
      clamp(roundToTwoDecimalPlaces(30 * DAY / denom)),
      clamp(roundToTwoDecimalPlaces(25 * MONTH / denom)),
      clamp(roundToTwoDecimalPlaces(25 * YEAR / denom)),
      clamp(roundToTwoDecimalPlaces(10 * DECADE / denom))
    ]
  },
  scaleOfViewportDateInterval(state: State, getters: any): DisplayScale {
    const weights = getters.timeMarkerWeights
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] > timeMarkerWeightMinimum) {
        return scales[i]
      }
    }
    return 'decade'
  },
  timeMarkers(state: State, getters: any): TimeMarker[] {
    const markers = [] as TimeMarker[]
    const scale = getters.scaleOfViewportDateInterval as DisplayScale
    const { from: leftViewportDate, to: rightViewportDate } = getters.viewportDateInterval as DateInterval

    let nextLeft = ceilDateTime(leftViewportDate, scale)
    let rightmost = ceilDateTime(rightViewportDate, scale)

    markers.push({
      dateTime: leftViewportDate,
      size: getters.distanceBetweenDates(leftViewportDate, nextLeft),
      left: getters.distanceBetweenDates(leftViewportDate, nextLeft),
      ts: leftViewportDate.toMillis()
    })

    // 256 is an arbitrary number
    while (nextLeft < rightmost && markers.length < 256) {
      markers.push({ dateTime: nextLeft, size: 0, ts: nextLeft.toMillis(), left: getters.distanceBetweenDates(leftViewportDate, nextLeft) })
      if (scale === 'decade') {
        nextLeft = nextLeft.plus({ years: 10 })
      } else {
        nextLeft = nextLeft.plus({ [scale]: 1 })
      }
      markers[markers.length - 1].size = getters.distanceBetweenDates(markers[markers.length - 1].dateTime, nextLeft)
    }

    // Get the last one
    markers[markers.length - 1].size = getters.distanceBetweenDates(markers[markers.length - 1].dateTime, rightmost)
    // console.log('scale:', scale)
    // console.log('from', leftViewportDate.toLocaleString(), 'to', rightViewportDate.toLocaleString())
    // console.log('num markers:', markers.length)
    // console.log('leftmost marker', m(markers[0]))
    // console.log('rightmost marker', m(markers[markers.length - 1]))
    // console.log('')
    return markers
  }
}

function m(m: TimeMarker): string {
  return `${m.dateTime.toLocaleString()}, ${m.size}px`
}

export const actions: ActionTree<State, State> = {
  nuxtServerInit(store: any, context: Context) {
    if (context.req.timelineFile) {
      store.commit('setEventsString', context.req.timelineFile)
    }
    if (context.req.timelinePath) {
      store.commit('setTimelinePath', context.req.timelinePath)
    }
  },
  setViewport({ commit, getters }, viewport) {
    const viewportInterval = getters.setDateIntervalFromViewport(viewport.left, viewport.width)
    commit('setViewport', viewport)
    commit('setViewportDateInterval', viewportInterval)
  }
}
