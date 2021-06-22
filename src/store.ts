import { State } from "vue"
import { createStore } from "vuex"
import { DateRange, EventDescription, Event, Settings, Tags } from "./Types"

export default createStore({
  state(): State {
    return {
      eventsString: `// Comments start with two slashes: \`//\`
// Tags start with an exclamation point: \`!\`
// Settings start with a pound sign: \`#\`

#yearWidth: 120

// This is an indication that events tagged \`!work\` will be colored #e13
!work: #e13

08/2008-05/2012: Psych degree !education
02/2010-06/2012: Dispatcher !work
10/2010: Barn built across the street
06/2011-08/2011: Westover Air Reserve Base !work

// 2013
03/15/2013-04/2015: China !work

// 2014
07/2014: 4th of July in DC

// 2015
05/2015-08/2015: Summer classes so I can graduate in two years !education
05/2015: James graduation
06/2015: Built desk
06/2015: Kim and Matt wedding
08/2015-05/2017: CS degree !education

// 2016
05/22/2016-08/12/2016: Cardinal Health !work
08/16/2016-08/27/2016: Italy

// 2017
05/2017-05/2018: Cladwell !work
06/10/2017-06/17/2017: The Hague & Copenhagen

// 2018
07/21/2018-07/22/2018: Chicago
07/26/2018-07/31/2018: LA and Seattle (interviewing)
08/04/2018-08/14/2018: Mexico City
09/05/2018-09/11/2018: Hong Kong and Macau
09/19/2018-09/22/2018: Road trip to Seattle
10/01/2018-01/2021: [Google](https://www.google.com) !work
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
02/01/2021-now: Working on [swink](https://sw.ink) full time !work
05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)
06/05/2021-06/12/2021: Ohio and James's Party`
    }
  },
  mutations: {
    setEventsString(state: State, str: string) {
      state.eventsString = str
    },
  },
  getters: {
    trimmedAndFilteredEntries(state: State): string[] {
      let eventStrings = state.eventsString.split("\n");

      // Filter empty strings and comments
      return eventStrings.filter(
        (str) => !!str && str.match(/^\s*\/\/.*/) === null
      ).map(str => str.trim());
    },
    events(state: State, getters: any): Event[] {
      return getters.trimmedAndFilteredEntries
        .filter((str: string) => !str.startsWith("!") && !str.startsWith("#"))
        .map((eventString: string) => {
          const colonIndex = eventString.indexOf(":");
          if (colonIndex === -1) {
            return null
          }
          const dateString = eventString.substring(0, colonIndex).trim();
          const dateRange = new DateRange(dateString);
          const eventDescription = new EventDescription(
            eventString.substring(colonIndex + 1).trim()
          );
          return new Event(dateRange, eventDescription)
        }).filter((event: Event | null) => !!event)
    },
    settings(state: State, getters: any): Settings {
      const settings: Settings = {
        yearWidth: 120
      }
      for (let entry of getters.trimmedAndFilteredEntries) {
        let e = entry as string
        if (e.startsWith("!yearWidth")) {
          const num = parseInt(e.substring(e.indexOf(":") + 1).trim())
          settings.yearWidth = num ? 120 : Math.min(1200, Math.max(10, num))
        }
      }
      return settings
    },
    tags(state: State, getters: any): Tags {

    }
  }
})