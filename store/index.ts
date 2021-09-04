import { Event, Tags } from "../Types"
interface State {
  list: string[],
  currentTimelineName: string,
  settings: {
    yearWidth: number
  },
  filter: string[]
  eventsString: string | null
}
export const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];

let currentTimelineName = ''
let list = [] as string[]
if (process.browser) {
  const concatenatedList = window && window.localStorage && window.localStorage.getItem("timelines")
  list = concatenatedList ? concatenatedList.split(',') : []
  currentTimelineName = list.length > 0 ? list[0] : ''
}

const exampleTimeline = `// Comments start with two slashes: \`//\`
// Tags start with a pound sign: \`#\`

// Add a shareable google photos link to display images. Events with the image icon have displayable images.

// This is an indication that events tagged \`#Work\` will be colored #e13
#Work: #e13

08/2008-05/2012: Psych degree #Education
02/2010-06/2012: Dispatcher #Work
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

export const state = () => ({
  list: list,
  currentTimelineName: currentTimelineName,
  settings: {
    yearWidth: 120
  },
  filter: [],
  eventsString: eventsString
})

export const mutations = {
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
  setYearWidth(state: State, width: number) {
    state.settings.yearWidth = width
  },
  setEventsString(state: State, str: string) {
    state.eventsString = str
  },
  clearFilters(state: State) {
    state.filter = []
  },
  filterTag(state: State, tag: string) {
    const index = state.filter.indexOf(tag)
    if (index >= 0 ) {
      state.filter.splice(index, 1)
    } else {
      state.filter.push(tag)
    }
  }
}
export const getters = {
  trimmedAndFilteredEntries(state: State): string[] {
    if (!state.eventsString) {
      return []
    }
    let eventStrings = state.eventsString.split("\n");

    // Filter empty strings and comments
    return eventStrings.filter(
      (str: string) => !!str && str.match(/^\s*\/\/.*/) === null
    ).map((str: string) => str.trim());
  },
  events(state: State, getters: any): Event[] {
    return getters.trimmedAndFilteredEntries
      .filter((str: string) => !str.startsWith("!") && !str.startsWith("#"))
      .map(Event.fromString).filter((event: Event | null) => !!event)
  },
  filteredEvents(state: State, getters: any): Event[] {
    return (getters.events as Event[])
      .filter(event =>
        state.filter.length === 0 ||
        event.event.tags.some(tag =>
          state.filter.includes(tag)))
  },
  tags(state: State, getters: any): Tags {
    let paletteIndex = 0
    const keys: Set<string> = new Set(getters.events.flatMap((event: Event) => event.event.tags))
    const coloredTags = getters.trimmedAndFilteredEntries
      .filter((str: string) => str.startsWith("#"))
      .map((str: string) => str.substring(1).split(": "))
    const tags = {} as { [tagName: string]: string }
    for (let tag of coloredTags) {
      tags[tag[0]] = tag[1]
    }
    for (let tag of keys) {
      if (!tags[tag]) {
        tags[tag] = COLORS[paletteIndex++ % COLORS.length]
      }
    }
    return tags
  }
}
