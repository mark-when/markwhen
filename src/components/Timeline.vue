<template>
  <div id="timeline" :style="timelineStyles">
    <div
      class="year"
      v-for="year in range(years.end - years.start + 1, years.start)"
      :key="year"
      :style="`grid-column: ${year - years.start + 1} / ${
        year - years.start + 2
      }; grid-row: 1 / -1;`"
    >
      <h6 class="yearTitle text-sm">{{ year }}</h6>
    </div>
    <div
      class="eventRow"
      v-for="(event, index) in events"
      :key="index"
      :style="{
        'grid-column': '1 / -1',
        'grid-row': index + 2,
        'margin-left': `${this.getLeftMarginForDate(event, event.range.from)}px`,
      }"
    >
      <div
        class="eventBar"
        :style="`width: ${this.getWidthForRange(event.range)}px; background-color: ${this.backgroundColor(event)}`"
      ></div>
      <p class="eventDate">{{ event.getDateHtml() }}</p>
      <p class="eventTitle" v-html="event.getInnerHtml()"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { BoundingYears, DateRange, Event, YearMonthDay } from "../Types";

const EVENT_HEIGHT_PX = 10;
const EVENT_SPACER_HEIGHT_PX = 5;

const COLOR_MAP = {
  red: "#ec1e1eb3",
  orange: "#ffa500c2",
  yellow: "#efef37a6",
  green: "#08a9089e",
  blue: "#7777e4a6",
  indigo: "#ab43f794",
  purple: '#d634d694',
  pink: '#ffc0cba6',
}

export default {
  props: ["events", "tags"],
  data() {
    return {
      numColumns: 0,
      numRows: 0,
      columnWidth: 120,
      years: { start: 2000, end: 2010 },
    };
  },
  watch: {
    events(val, oldVal) {
      this.years = this.getBoundingYears(this.events);
      this.numColumns = this.years.end - this.years.start;
      this.numRows = val.length + 1;
    },
  },
  computed: {
    timelineStyles(): string {
      return `
          grid-template-columns: repeat(${this.numColumns}, ${
        this.columnWidth
      }px [year-start]);
          grid-template-rows: 40px repeat(${this.numRows - 1}, ${
        EVENT_HEIGHT_PX + EVENT_SPACER_HEIGHT_PX + 4
      }px) minmax(50vh, 1fr);`;
    },
  },
  methods: {
    backgroundColor(event: Event) {
      const eventTags = event.event.tags
    },
    getWidthForRange(range: DateRange): number {
      if (range.to) {
        const restOfYear =
          (13 - (range.from.month ?? 1)) * (this.columnWidth / 12);
        if (!range.to.month) {
          // No 'to' month, go through full 'to' year
          if (range.from.year === range.to.year) {
            return restOfYear;
          } else {
            return (
              restOfYear + (range.to.year - range.from.year) * this.columnWidth
            );
          }
        } else {
          if (range.from.year === range.to.year) {
            return (
              (1 + range.to.month - (range.from.month ?? 1)) *
              (this.columnWidth / 12)
            );
          } else {
            return (
              restOfYear +
              (range.to.year - range.from.year - 1) * this.columnWidth +
              range.to.month * (this.columnWidth / 12)
            );
          }
        }
      } else {
        if (!range.from.month) {
          return this.columnWidth;
        }
        return EVENT_HEIGHT_PX;
      }
    },
    getLeftMarginForDate(event: Event, date: YearMonthDay): number {
      let base = (event.startingYear() - this.years.start) * this.columnWidth;
      if (date.month) {
        return base + (120 / 12) * (date.month - 1);
      }
      return base + 0;
    },
    range(size: number, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
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
      return { start: min - 1, end: max + 6 };
    },
  },
};
</script>

<style>
#timeline {
  display: grid;
  overflow: auto;
  height: 100%;
}
.year {
  border-left: 1px dashed gray;
  height: 100%;
  font-family: system-ui;
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
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.eventBar {
  background-color: #ffffff4a;
  border-radius: 5px;
  height: 10px;
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
</style>