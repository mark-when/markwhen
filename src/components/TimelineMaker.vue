<template>
  <div class="flex flex-col">
    <div class="flex">
      <iframe
        frameborder="0"
        ref="frame"
        class="flex-grow"
      ></iframe>
    </div>
    <div class="flex flex-row">
      <a
        :href="base64string"
        target="_blank"
        download="timeline.html"
        class="bg-blue-100 mt-3 rounded shadow-md hover:shadow-none transition-all duration-100 px-2"
        >Download HTML</a
      >
    </div>
  </div>
</template>

<script lang="ts">
type Year = number;
type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 21
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

interface YearMonthDay {
  year: Year;
  month?: Month;
  day?: Day;
}

interface BoundingYears {
  start: Year;
  end: Year;
}

class DateRange {
  from: YearMonthDay;
  to?: YearMonthDay;
  originalString: string

  constructor(dateString: string) {
    this.originalString = dateString
    const commentIndex = dateString.indexOf("//");
    if (commentIndex >= 0) {
      dateString = dateString.substring(0, commentIndex);
    }
    const [unparsedFrom, unparsedTo] = dateString.split("-");
    this.from = this.toYearMonthDay(unparsedFrom);
    this.to = unparsedTo ? this.toYearMonthDay(unparsedTo) : undefined;
  }

  toYearMonthDay(str: string): YearMonthDay {
    if (str === "now") {
      str = new Date().toLocaleDateString();
    }
    let [year, day, month] = str.split("/").reverse();
    const yearNumber = parseInt(year);
    if (!day) {
      return { year: yearNumber };
    }
    if (!month) {
      return { year: yearNumber, month: parseInt(day) as Month };
    }
    return {
      year: yearNumber,
      month: parseInt(month) as Month,
      day: parseInt(day) as Day,
    };
  }

  getNextYear(): Year {
    if (this.to) {
      return this.to.year + 1;
    }
    return this.from.year + 1;
  }
}

class Event {
  range: DateRange;
  event: string;
  linkRegex = /\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/g;

  constructor(range: DateRange, event: string) {
    this.range = range;
    this.event = event;
  }

  startingYear(): Year {
    return this.range.from.year;
  }

  getNextYear(): Year {
    return this.range.getNextYear();
  }

  getInnerHtml(): string {
    return this.event.replace(this.linkRegex, (substring, linkText, link) => {
      return `<a href="${link}">${linkText}</a>`;
    });
  }

  getDateHtml(): string {
    return this.range.originalString
  }
}

const YEAR_WIDTH_PX = 120;
const EVENT_HEIGHT_PX = 10;
const EVENT_SPACER_HEIGHT_PX = 5;

import { debounce } from "throttle-debounce";

export default {
  props: {
    eventString: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      htmlString: "",
    };
  },
  watch: {
    eventString: function (val, oldVal) {
      this.debouncedParse();
    },
  },
  computed: {
    frame(): HTMLIFrameElement {
      return this.$refs.frame as HTMLIFrameElement;
    },
    frameDoc(): HTMLDocument {
      return this.frame.contentDocument!;
    },
    base64string(): string {
      return `data:text/html;base64,${btoa(this.htmlString)}`;
    },
  },
  created() {
    this.debouncedParse = debounce(400, this.parse);
  },
  methods: {
    debouncedParse: () => {},
    parse() {
      let eventStrings = this.eventString.split("\n");
      const events = eventStrings
        // Filter empty strings and comments
        .filter((str) => !!str && str.match(/^\s*\/\/.*/) === null)
        .map((eventString) => {
          const colonIndex = eventString.indexOf(":");
          if (colonIndex === -1) {
            throw new Error(
              `Error parsing '${eventString}': missing separating colon (:)`
            );
          }
          const dateString = eventString.substring(0, colonIndex).trim();
          return new Event(
            new DateRange(dateString),
            eventString.substring(colonIndex + 1).trim()
          );
        });
      const boundingYears = this.getBoundingYears(events);
      if (boundingYears.end - boundingYears.start > 1000) {
        throw new Error("Can't make a timeline that long");
      }
      this.generateDocument(boundingYears, events);
    },
    getBoundingYears(events: Event[]): BoundingYears {
      let min = events[0].startingYear();
      let max = events[0].getNextYear();
      for (let event of events) {
        if (event.startingYear() < min) {
          min = event.startingYear();
        }
        if (event.getNextYear() > max) {
          max = event.getNextYear();
        }
      }
      return { start: min, end: max };
    },
    range(size: number, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
    },
    generateDocument(years: BoundingYears, events: Event[]) {
      this.frame.contentWindow?.document.open().write("");
      this.frame.contentWindow?.document.close();
      const styles = this.frameDoc.createElement("style");
      styles.innerText = this.getStyles(
        years.end - years.start,
        YEAR_WIDTH_PX,
        events.length + 1
      );
      this.frameDoc.head.append(styles);
      const timeline = this.frameDoc.createElement("div");
      timeline.id = "timeline";

      this.addYearHeaders(years, timeline);
      this.addEvents(events, years.start, timeline);

      this.frameDoc.body.append(timeline);
      this.htmlString =
        this.frameDoc.head.innerHTML + this.frameDoc.body.innerHTML;
    },
    addYearHeaders(years: BoundingYears, intoParent: HTMLDivElement) {
      for (let year of this.range(years.end - years.start + 1, years.start)) {
        this.addYearHeader(year, years.start, intoParent);
      }
    },
    addYearHeader(year: Year, startingYear: Year, intoParent: HTMLDivElement) {
      const startColumn = year - startingYear + 1;
      const endColumn = startColumn;
      const yearDiv = this.frameDoc.createElement("div");
      const yearTitle = this.frameDoc.createElement("h6");
      yearTitle.innerText = `${year}`;
      yearTitle.className = "yearTitle";
      yearDiv.className = "year";
      yearDiv.style.cssText = `grid-column: ${startColumn} / ${endColumn}; grid-row: 1 / -1;`;
      yearDiv.append(yearTitle);
      intoParent.append(yearDiv);
    },
    addEvents(events: Event[], startingYear: Year, intoParent: HTMLDivElement) {
      for (let i = 0; i < events.length; i++) {
        this.addEventAtRow(events[i], i + 2, startingYear, intoParent);
      }
    },
    addEventAtRow(
      event: Event,
      row: number,
      startingYear: Year,
      intoParent: HTMLDivElement
    ) {
      const eventRow = this.frameDoc.createElement("div");
      eventRow.className = "eventRow";
      eventRow.style.cssText = `grid-column: 1 / -1; grid-row: ${row}; margin-left: ${
        (event.startingYear() - startingYear) * YEAR_WIDTH_PX +
        this.getLeftMarginForDate(event.range.from)
      };`;
      const eventBar = this.frameDoc.createElement("div");
      eventBar.style.cssText = `width: ${this.getWidthForRange(
        event.range
      )}px;`;
      eventBar.className = "eventBar";
      const eventTitle = this.frameDoc.createElement("p");
      eventTitle.className = "eventTitle";
      eventTitle.innerHTML = event.getInnerHtml();
      const eventDate = this.frameDoc.createElement("p");
      eventDate.className = "eventDate"
      eventDate.innerText = event.getDateHtml();
      eventRow.append(eventBar);
      eventRow.append(eventDate);
      eventRow.append(eventTitle);
      intoParent.append(eventRow);
    },
    getLeftMarginForDate(date: YearMonthDay): number {
      if (date.month) {
        return (YEAR_WIDTH_PX / 12) * (date.month - 1);
      }
      return 0;
    },
    getWidthForRange(range: DateRange): number {
      if (range.to) {
        const restOfYear =
          (13 - (range.from.month ?? 1)) * (YEAR_WIDTH_PX / 12);
        if (!range.to.month) {
          // No 'to' month, go through full 'to' year
          if (range.from.year === range.to.year) {
            return restOfYear;
          } else {
            return (
              restOfYear + (range.to.year - range.from.year) * YEAR_WIDTH_PX
            );
          }
        } else {
          if (range.from.year === range.to.year) {
            return (
              (1 + range.to.month - (range.from.month ?? 1)) *
              (YEAR_WIDTH_PX / 12)
            );
          } else {
            return (
              restOfYear +
              (range.to.year - range.from.year - 1) * YEAR_WIDTH_PX +
              range.to.month * (YEAR_WIDTH_PX / 12)
            );
          }
        }
      } else {
        if (!range.from.month) {
          return YEAR_WIDTH_PX;
        }
        return EVENT_HEIGHT_PX;
      }
    },
    getStyles(
      numColumns: number,
      columnWidth: number,
      numRows: number
    ): string {
      return `
        body {
          background-color: #384047; 
          color: white; 
          height: 100vh;
          margin: 0;
        }
        
        #timeline {
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${numColumns}, ${columnWidth}px [year-start]);
          grid-template-rows: 40px repeat(${numRows - 1}, ${
        EVENT_HEIGHT_PX + EVENT_SPACER_HEIGHT_PX + 4
      }px) minmax(40px, 1fr);
        }

        .year {
          border-left: 1px dashed gray;
          height: 100%;
          font-family: system-ui
        }

        .yearTitle {
          font-weight: 300;
          margin: 0px 0px 0px 0px;
          position: sticky;
          top: 0px;
          padding: 8px;
          background: linear-gradient(to bottom, #384047, 77%, #38404700);
        }

        .eventRow {
          margin-top: ${EVENT_SPACER_HEIGHT_PX}px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .eventBar {
          background-color: #ffffff4a;
          border-radius: ${EVENT_HEIGHT_PX / 2}px;
          height: ${EVENT_HEIGHT_PX};
          flex-shrink: 0;
          transition: background-color 0.075s ease-in-out;
        }

        .eventRow:hover .eventBar {
          background-color: white;
        }

        .eventTitle {
          margin: 0px 0px 0px 8px;
          padding: 0px 48px 0px 0px;
          font-family: system-ui;
          font-size: 80%;
          white-space: nowrap;
        }

        .eventDate {
          color: #93979a;
          font-family: system-ui;
          font-size: 80%;
          margin: 0px 0px 0px 8px;
          white-space: nowrap;
        }

        .eventTitle a {
          color: white;
        }
      `.replaceAll(/(?:\r|\n)/g, "");
    },
  },
  mounted() {
    this.parse();
  },
};
</script>

<style>
iframe {
  border: 1px solid black;
  width: 800px;
  min-height: 500px;
  height: 80vh;
}
</style>