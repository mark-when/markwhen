<template>
  <div class="relative" :style="containerStyle">
    <div id="years" class="flex absolute inset-0 pointer-events-none">
      <year
        v-for="year in range(years.end - years.start + 1, years.start)"
        :key="year"
        :year="year"
        :columnWidth="columnWidth"
      />
    </div>
    <div id="events">
      <div class="h-24"></div>
      <transition-group name="eventRow">
        <event-row
          v-for="event in $store.getters.filteredEvents"
          :key="event.eventString"
          :event="event"
          :widthPerDay="widthPerDay"
          :startYear="years.start"
          :columnWidth="columnWidth"
        ></event-row>
      </transition-group>
      <div style="height: 50vh"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { BoundingYears } from "../Types";
import EventRow from "./EventRow.vue";
import Year from "./Year.vue";

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
  components: { EventRow, Year },
  data() {
    return {
      panning: {} as Panning,
    };
  },
  computed: {
    containerStyle(): string {
      return `width: ${this.columnWidth * this.numColumns}px`;
    },
    isPanning(): boolean {
      return !!this.panning?.mouseStart?.x && !!this.panning?.mouseStart?.y;
    },
    columnWidth(): number {
      return this.$store.state.settings.yearWidth;
    },
    years(): BoundingYears {
      const events = this.$store.getters.events;

      if (!events || events.length === 0) {
        return { start: 2010, end: 2020 };
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
      return { start: min - 1, end: max + 2 + Math.floor(5 * (100 / this.columnWidth)) };
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
  // created() {
  //   const container = document.getElementById("timelineContainer")!;
  //   container.addEventListener("mousedown", this.mouseDown);
  //   window.addEventListener("mouseup", this.mouseUp);
  //   window.addEventListener("mousemove", this.mouseMove);
  // },
  methods: {
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

.eventRow {
  margin-top: 5px;
}

.eventRow:hover .eventBar {
  @apply opacity-90 shadow-lg;
}

.eventRow:hover .photoBar {
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