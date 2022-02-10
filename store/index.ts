import { Context } from "@nuxt/types";
import { parse } from "~/Parser";
import { Cascade, CascadeMetadata, Event, Tags } from "../Types"
import { MutationTree, GetterTree, ActionTree } from "vuex"
import { DateTime } from "luxon";
import e from "express";
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
}

interface DateInterval {
  from: DateTime
  to: DateTime
}

export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];

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
    scale: 100
  },
  filter: [],
  eventsString: eventsString || undefined,
  timelinePath: '',
  username: '',
  dirtyEditor: false,
  hasSeenHowTo: true,
  viewportDateInterval: {
    from: DateTime.now(),
    to: DateTime.now()
  }
})

export type DisplayScale =
  | "decade"
  | "years"
  | "months"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

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
    state.settings.scale = Math.max(1, Math.min(10000, width))
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
}

function floorDateTime(dateTime: DateTime, toScale: DisplayScale) {
  const year = dateTime.year
  if (toScale === 'decade') {
    const roundedYear = year - year % 10
    return DateTime.fromObject({ year: roundedYear })
  }
  if (toScale === 'years') {
    return DateTime.fromObject({ year })
  }
  const month = dateTime.month
  if (toScale === 'months') {
    return DateTime.fromObject({ year, month })
  }
  const day = dateTime.day
  if (toScale === 'days') {
    return DateTime.fromObject({ year, month, day })
  }
  const hour = dateTime.hour
  if (toScale === 'hours') {
    return DateTime.fromObject({ year, month, day, hour })
  }
  const minute = dateTime.minute
  if (toScale === 'minutes') {
    return DateTime.fromObject({ year, month, day, hour, minute })
  }
  const second = dateTime.second
  return DateTime.fromObject({ year, month, day, hour, minute, second })
}

export const getters: GetterTree<State, State> = {
  trimmedAndFilteredEntries(state: State): string[] {
    if (!state.eventsString) {
      return []
    }
    let eventStrings = state.eventsString.split("\n");

    // Filter empty strings, comments, and malformatted lines
    const filter = function (eventString: string): boolean {
      if (!eventString) {
        return false
      }
      if (eventString.match(/^\s*\/\/.*/)) {
        return false
      }
      return true
    }
    return eventStrings.filter(filter).map((str: string) => str.trim());
  },
  cascade(state: State, getters: any): Cascade {
    const cascade = parse(state.eventsString)
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
    return (a: DateTime, b: DateTime) => b.diff(a).as('years') * state.settings.scale
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
      const earliest = getters.metadata.earliestTime as DateTime
      const leftDate = earliest.plus({ years: scrollLeft / state.settings.scale })
      const rightDate = earliest.plus({ years: (scrollLeft + width) / state.settings.scale })
      return { from: leftDate, to: rightDate }
    }
  },
  scaleOfViewportDateInterval(state: State, getters: any): DisplayScale {
    const diff = getters.viewportDateInterval.to.diff(getters.viewportDateInterval.from).as("seconds")

    const MINUTE = 60
    if (diff < MINUTE) {
      return "seconds"
    }

    const HOUR = 60 * MINUTE
    if (diff < HOUR) {
      return "minutes"
    }

    const DAY = 24 * HOUR
    if (diff < DAY) {
      return 'hours'
    }

    const MONTH = 30 * DAY
    if (diff < MONTH) {
      return 'days'
    }

    const YEAR = 12 * MONTH
    if (diff < YEAR) {
      return 'months'
    }

    const DECADE = 10 * YEAR
    if (diff < DECADE) {
      return "years"
    }
    return 'decade'
  },
  timeMarkers(state: State, getters: any) {
    const markers = []
    const scale = getters.scaleOfViewportDateInterval as DisplayScale
    const { from: leftViewportDate, to: rightViewportDate } = getters.viewportDateInterval as DateInterval

    let rightmost
    if (scale === 'decade') {
      rightmost = rightViewportDate.plus({ years: 10 })
    } else {
      rightmost = rightViewportDate.plus({ [scale]: 30 })
    }

    let nextLeft
    if (scale === 'decade') {
      nextLeft = floorDateTime(leftViewportDate, scale).minus({ years: 10 })
    } else {
      nextLeft = floorDateTime(leftViewportDate, scale).minus({ [scale]: 30 })
    }

    while (nextLeft < rightmost && markers.length < 300) {
      markers.push(nextLeft)
      if (scale === 'decade') {
        nextLeft = nextLeft.plus({ years: 10 })
      } else {
        nextLeft = nextLeft.plus({ [scale]: 1 })
      }
    }
    console.log(`${markers.length} markers at ${scale} scale`)
    return markers
  }
}

export const actions: ActionTree<State, State> = {
  nuxtServerInit(store: any, context: Context) {
    if (context.req.timelineFile) {
      store.commit('setEventsString', context.req.timelineFile)
    }
    if (context.req.timelinePath) {
      store.commit('setTimelinePath', context.req.timelinePath)
    }
  }
}
