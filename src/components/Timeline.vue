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
      v-for="(event, index) in $store.getters.events"
      :key="index"
      :style="{
        'grid-column': '1 / -1',
        'grid-row': index + 2,
        'margin-left': `${this.getLeftMarginForDate(
          event,
          event.range.from
        )}px`,
      }"
    >
      <div :class="eventBarClass(event)" :style="eventBarStyle(event)"></div>
      <p class="eventDate">{{ event.getDateHtml() }}</p>
      <p class="eventTitle" v-html="event.getInnerHtml()"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { BoundingYears, DateRange, Event, Tags, YearMonthDay } from "../Types";

const EVENT_HEIGHT_PX = 10;
const EVENT_SPACER_HEIGHT_PX = 5;

/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 * If a user specifies a different color, use that.
 */

const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];

export default {
  computed: {
    columnWidth(): number {
      return this.$store.getters.settings.yearWidth
    },
    coloredTags(): Tags {
      const tags = this.$store.getters.tags
      let paletteIndex = 0;
      const coloredTags = {} as { [tagName: string]: string }
      for (let tag of Object.keys(tags)) {
        if (!tags[tag]) {
          coloredTags[tag] = COLORS[paletteIndex++ % COLORS.length];
        } else {
          coloredTags[tag] = tags[tag]
        }
      }
      return coloredTags
    },
    timelineStyles(): string {
      return `
          grid-template-columns: repeat(${this.numColumns}, ${
        this.columnWidth
      }px [year-start]);
          grid-template-rows: 40px repeat(${this.numRows - 1}, ${
        EVENT_HEIGHT_PX + EVENT_SPACER_HEIGHT_PX + 4
      }px) minmax(50vh, 1fr);`;
    },
    years(): BoundingYears {
      const events = this.$store.getters.events

      if (!events || events.length === 0) {
        return { start: 2000, end: 2010 }
      }

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
    numColumns(): number {
      return this.years.end - this.years.start
    },
    numRows(): number {
      return this.$store.getters.events.length + 1
    }
  },
  methods: {
    eventBarClass(event: Event): string {
      let c = "eventBar transition opacity-50 rounded shadow ";
      const tag = event.event.tags[0];
      if (this.coloredTags[tag]) {
        if (COLORS.includes(this.coloredTags[tag])) {
          c += `bg-${this.coloredTags[tag].toLowerCase()}-300 `;
        }
      } else {
        c += `bg-gray-300 `;
      }
      return c;
    },
    eventBarStyle(event: Event): string {
      let style = `width: ${this.getWidthForRange(event.range)}px;`;
      const tag = event.event.tags[0];
      if (this.coloredTags[tag] && !COLORS.includes(this.coloredTags[tag])) {
        style += ` background-color: ${this.coloredTags[tag]}`;
      }
      return style;
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
        return base + (this.columnWidth / 12) * (date.month - 1);
      }
      return base + 0;
    },
    range(size: number, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
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
  margin: 0px 0px 0px -1px;
  position: sticky;
  top: 0px;
  padding: 8px;
  background: linear-gradient(to bottom, #384047, 67%, #38404700);
  z-index: 1;
}

.eventRow {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.eventRow:hover .eventBar {
  @apply opacity-90 shadow-lg;
}

.eventBar {
  border-radius: 5px;
  height: 10px;
  flex-shrink: 0;
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