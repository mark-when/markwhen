<template>
  <div class="relative">
    <div id="years" class="flex absolute inset-0 pointer-events-none">
      <div
        class="year flex-shrink-0 relative"
        v-for="year in range(years.end - years.start + 1, years.start)"
        :key="year"
        :style="`width: ${this.columnWidth}px`"
      >
        <h6 class="yearTitle text-sm">{{ year }}</h6>
        <div
          class="absolute h-full"
          v-for="m in range(12, 0)"
          :key="m"
          :style="styleForMonth(m)"
        ></div>
      </div>
    </div>
    <div id="events">
      <div class="h-24"></div>
      <transition-group name="eventRow">
        <div
          class="eventRow"
          v-for="event in $store.getters.filteredEvents"
          :key="event.eventString"
          :style="eventRowStyle(event)"
        >
          <div
            class="
              eventItem
              flex-row
              items-center
              inline-flex
              rounded
              -mx-2
              px-2
              py-1
              hover:bg-gray-900
              cursor-pointer
              transition
            "
          >
            <div
              :class="eventBarClass(event)"
              :style="eventBarStyle(event)"
            ></div>
            <p class="eventDate">{{ event.getDateHtml() }}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2 mb-px"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="eventTitle ml-2" v-html="event.getInnerHtml()"></p>
          </div>
        </div>
      </transition-group>
      <div style="height: 50vh"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { BoundingYears, DateRange, Event, Tags, YearMonthDay } from "../Types";

const EVENT_HEIGHT_PX = 10;

/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 * If a user specifies a different color, use that.
 */

const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];

interface Panning {
  mouseStart?: {
    x: number;
    y: number;
  };
  containerStart?: {
    x: number;
    y: number;
  };
}

export default {
  data() {
    return {
      panning: {} as Panning,
    };
  },
  computed: {
    isPanning(): boolean {
      return !!this.panning?.mouseStart?.x && !!this.panning?.mouseStart?.y;
    },
    columnWidth(): number {
      return this.$store.state.settings.yearWidth;
    },
    years(): BoundingYears {
      const events = this.$store.getters.events;

      if (!events || events.length === 0) {
        return { start: 2000, end: 2010 };
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
      return this.years.end - this.years.start;
    },
    numRows(): number {
      return this.$store.getters.events.length + 1;
    },
    widthPerDay(): number {
      return this.columnWidth / 12 / 30;
    },
  },
  created() {
    const container = document.getElementById("timelineContainer")!;
    container.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mouseup", this.mouseUp);
    window.addEventListener("mousemove", this.mouseMove);
  },
  methods: {
    eventRowStyle(event: Event) {
      return `margin-left: ${this.getLeftMarginForDate(
        event,
        event.range.from
      )}px`;
    },
    styleForMonth(m: number) {
      const sty = {
        top: "0px",
        left: `${m * (this.columnWidth / 12)}px`,
      } as any;
      if (m !== 0 && m !== 12 && this.columnWidth > 600) {
        let alpha = 0.2;
        sty["border-left"] = `1px dashed rgba(128, 128, 128, ${
          alpha + 0.3 * (this.columnWidth / 1600)
        })`;
      }
      return sty;
    },
    mouseDown(e: MouseEvent) {
      e.stopPropagation();
      const container = document.getElementById("timelineContainer")!;
      container.style.cssText = "cursor: grabbing;";
      this.panning = {
        mouseStart: {
          x: e.clientX,
          y: e.clientY,
        },
        containerStart: {
          x: container.scrollLeft,
          y: container.scrollTop,
        },
      };
    },
    mouseUp(e: MouseEvent) {
      const container = document.getElementById("timelineContainer")!;
      container.style.cssText = "cursor: grab;";
      this.panning = {};
    },
    mouseMove(e: MouseEvent) {
      if (!this.isPanning) {
        return;
      }
      e.stopPropagation();
      const container = document.getElementById("timelineContainer")!;
      container.scrollLeft =
        this.panning.containerStart!.x +
        (this.panning.mouseStart!.x - e.clientX);
      container.scrollTop =
        this.panning.containerStart!.y +
        (this.panning.mouseStart!.y - e.clientY);
    },
    eventBarClass(event: Event): string {
      let c = "eventBar transition opacity-50 rounded-lg shadow ";
      const tag = event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        if (COLORS.includes(this.$store.getters.tags[tag])) {
          c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-300 `;
        }
      } else {
        c += `bg-gray-300 `;
      }
      return c;
    },
    eventBarStyle(event: Event): string {
      let style = `width: ${this.getWidthForRange(event.range)}px;`;
      const tag = event.event.tags[0];
      if (
        this.$store.getters.tags[tag] &&
        !COLORS.includes(this.$store.getters.tags[tag])
      ) {
        style += ` background-color: ${this.$store.getters.tags[tag]}`;
      }
      return style;
    },
    getWidthForRange(range: DateRange): number {
      const width = Math.max(
        EVENT_HEIGHT_PX,
        Math.max(1, range.numDays()) * this.widthPerDay
      );
      console.log(range.numDays() * this.widthPerDay);
      console.log("width for ", range, width);
      return width;
    },
    getLeftMarginForDate(event: Event, date: YearMonthDay): number {
      let base = (event.startingYear() - this.years.start) * this.columnWidth;
      if (date.month) {
        const monthOffset = (this.columnWidth / 12) * (date.month - 1);
        if (date.day) {
          return (
            base + monthOffset + (date.day - 1) * (this.columnWidth / 12 / 30)
          );
        } else {
          return base + monthOffset;
        }
      }
      return base + 0;
    },
    range(size: number, startAt = 0): number[] {
      return [...Array(size).keys()].map((i) => i + startAt);
    },
  },
};
</script>

<style>
/* .company {
  backface-visibility: hidden;
  z-index: 1;
} */

/* moving */
.eventRow-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.eventRow-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.eventRow-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.eventRow-enter-from,
.eventRow-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.year {
  border-left: 1px dashed rgba(128, 128, 128, 0.678);
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