<template>
  <div
    class="eventRow relative flex"
    :style="eventRowStyle"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <template v-if="$store.state.edittable">
      <move-widgets
        v-show="hovering"
        @move="move"
        @moveUp="moveUp"
        @moveDown="moveDown"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      />
    </template>
    <div
      v-if="showingMeta"
      :class="photoBarClass"
      class="absolute left-0 mr-2 bottom-2 z-10 opacity-50"
      :style="photoBarStyle"
    ></div>
    <div class="flex flex-row">
      <div
        class="
          eventItem
          flex-row
          items-center
          flex
          rounded
          -mx-2
          px-2
          py-1
          transition
        "
        :class="{
          'dark:hover:bg-gray-800 hover:bg-white hover:shadow-lg': hasMeta,
          'dark:bg-gray-900 bg-white shadow-lg': showingMeta,
          'cursor-pointer': hasMeta,
        }"
        v-on="hasMeta ? { click: togglePhotos } : {}"
      >
        <event-bar
          :event="event"
          :hovering="hovering"
          :width="width"
          @startResizeLeft="startResizeLeft"
          @startResizeRight="startResizeRight"
        />
        <p class="eventDate">{{ event.getDateHtml() }}</p>
        <svg
          v-if="hasImages && imageStatus !== 'loading'"
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
        <svg
          v-else-if="hasImages && imageStatus === 'loading'"
          class="animate-spin h-3 w-3 ml-3 mb-px"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-if="hasLocations"
          class="h-4 w-4 ml-2 mb-px"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          ></path>
        </svg>
        <p class="eventTitle ml-2">
          <span v-html="event.getInnerHtml()"></span>
          <span v-if="hasSupplemental && !showingMeta">...</span>
        </p>
      </div>
    </div>
    <event-meta
      v-if="canShowMeta"
      :locations="locations"
      :images="images"
      :supplemental="supplemental"
      :photosLink="event.event.googlePhotosLink"
    />
  </div>
</template>

<script lang="ts">
import { DateRange, Event } from "../../src/Types";
import Vue from "vue";
import EventMeta from "./EventMeta.vue";
import { mapGetters } from "vuex";
import EventBar from "./EventBar.vue";
import { DateTime } from "luxon";
import { roundDateTime } from "~/store";
import MoveWidgets from "./MoveWidgets.vue";

export const EVENT_HEIGHT_PX = 10;

export default Vue.extend({
  components: { EventMeta, EventBar, MoveWidgets },
  props: ["event"],
  data() {
    return {
      imageStatus: "not loaded",
      images: [],
      showingMeta: false,
      hover: false,
      tempTo: undefined as DateTime | undefined,
      tempFrom: undefined as DateTime | undefined,
    };
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
    hovering(): boolean {
      return this.hover || !!this.tempTo || !!this.tempFrom;
    },
    locations(): string[] {
      return this.event.event.locations.map(
        (location: string) =>
          `https://www.google.com/maps/embed/v1/place?key=AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU&q=${location}`
      );
    },
    supplemental(): string[] {
      return this.event.event.supplemental;
    },
    canShowMeta(): boolean {
      if (this.images.length > 0) {
        return this.showingMeta && this.imageStatus === "loaded";
      }
      if (this.hasLocations || this.hasSupplemental) {
        return this.showingMeta;
      }
      return false;
    },
    hasMeta(): boolean {
      return this.hasImages || this.hasLocations || this.hasSupplemental;
    },
    hasLocations(): boolean {
      return this.event.event.locations.length > 0;
    },
    hasImages(): boolean {
      return !!this.event.event.googlePhotosLink;
    },
    hasSupplemental(): boolean {
      return !!this.supplemental.length;
    },
    eventRowStyle(): string {
      const leftMargin = this.distanceFromBaselineLeftmostDate(
        this.tempFrom ? this.tempFrom : this.event.range.fromDateTime
      );
      return `margin-left: ${leftMargin}px;`;
    },
    photoBarClass(): string {
      let c = "photoBar transition rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (!this.$store.getters.tags[tag]) {
        c += `bg-gray-300 `;
      }
      if (this.hovering) {
        c += `opacity-80 shadow-lg `;
      }
      return c;
    },
    barColor(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        style += ` background-color: rgba(${this.$store.getters.tags[tag]}, 0.6)`;
      }
      return style;
    },
    photoBarStyle(): string {
      return `width: 10px; ${this.barColor}; top: calc(0.5rem + 3px)`;
    },
    width(): number {
      if (this.tempTo && this.tempFrom) {
        return this.getWidthForRange({
          fromDateTime: this.tempFrom,
          toDateTime: this.tempTo,
        });
      }
      if (this.tempTo) {
        return this.getWidthForRange({
          fromDateTime: this.event.range.fromDateTime,
          toDateTime: this.tempTo,
        });
      }
      if (this.tempFrom) {
        return this.getWidthForRange({
          fromDateTime: this.tempFrom,
          toDateTime: this.event.range.toDateTime,
        });
      }
      return this.getWidthForRange(this.event.range);
    },
  },
  methods: {
    moveUp() {
      console.log("move up");
    },
    moveDown() {
      console.log("move down");
    },
    startResizeLeft(e: MouseEvent | TouchEvent) {
      const vm = this;
      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          x = e.clientX;
          e.preventDefault();
        }
        const date = this.$store.getters.dateFromOffsetLeft(x) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempFrom = rounded;
      };
      const upListener = (ev: MouseEvent | TouchEvent) => {
        if (ev instanceof TouchEvent) {
        } else {
          ev.preventDefault();
        }
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          from: vm.tempFrom,
          to: (vm.event as Event).range.toDateTime,
        });
        vm.tempFrom = undefined;
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", upListener);
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("touchend", upListener);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("touchend", upListener);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    startResizeRight(e: MouseEvent) {
      const vm = this;
      vm.tempTo = (vm.event as Event).range.toDateTime;
      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          x = e.clientX;
          e.preventDefault();
        }
        const date = this.$store.getters.dateFromOffsetLeft(x) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempTo = rounded;
      };
      const upListener = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          to: vm.tempTo,
          from: (vm.event as Event).range.fromDateTime,
        });
        vm.tempTo = undefined;
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", upListener);
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("touchend", upListener);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("touchend", upListener);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    move() {
      const vm = this;
      vm.tempFrom = (vm.event as Event).range.fromDateTime;
      vm.tempTo = (vm.event as Event).range.toDateTime;
      const diff = vm.tempTo.diff(vm.tempFrom).as("days");

      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          e.preventDefault();
          x = e.clientX;
        }
        // + 18 because of where the handle is
        const date = this.$store.getters.dateFromOffsetLeft(x + 18) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempFrom = rounded;
        vm.tempTo = rounded.plus({ days: diff });
      };

      const moveEnd = (e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent) {
        } else {
          e.preventDefault();
        }
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          from: vm.tempFrom,
          to: vm.tempTo,
        });
        vm.tempTo = undefined;
        vm.tempFrom = undefined;
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", moveEnd);
        document.removeEventListener("touchend", moveEnd);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("mouseup", moveEnd);
      document.addEventListener("touchend", moveEnd);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    async loadImages() {
      this.imageStatus = "loading";
      const imagesResponse = await fetch(
        `https://k.npkn.net/google-photos/${this.event.event.googlePhotosLink}`
      );
      this.images = await imagesResponse.json();
      this.imageStatus = "loaded";
    },
    togglePhotos(e: MouseEvent) {
      if (e.target instanceof HTMLAnchorElement) {
        return;
      }
      e.preventDefault();
      this.showingMeta = !this.showingMeta;
      if (this.imageStatus === "not loaded" && this.hasImages) {
        this.loadImages();
      }
    },
    getWidthForRange(range: DateRange): number {
      const distance = this.$store.getters.distanceBetweenDates(
        range.fromDateTime,
        range.toDateTime
      );
      const newWidth = Math.max(EVENT_HEIGHT_PX, distance);
      return newWidth;
    },
  },
});
</script>

<style>
.photoBar {
  width: 10px;
}
.eventRow {
  padding-top: 2px;
  padding-bottom: 2px;
}

.eventDate {
  color: #93979a;
  font-family: system-ui;
  font-size: 80%;
  margin: 0px 0px 0px 8px;
  white-space: nowrap;
}

/* .eventRow:hover .eventBar {
  @apply opacity-80 shadow-lg;
} */

/* .eventRow:hover .photoBar {
  @apply opacity-80 shadow-lg;
}

.eventRow:hover .percentBar {
  @apply opacity-100
} */
</style>