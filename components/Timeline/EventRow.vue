<template>
  <div class="eventRow relative" :style="eventRowStyle">
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
          'hover:bg-gray-800 hover:shadow-lg': hasMeta,
          'bg-gray-900 shadow-lg': showingMeta,
          'cursor-pointer': hasMeta,
        }"
        v-on="hasMeta ? { click: togglePhotos } : {}"
      >
        <div :class="eventBarClass" :style="eventBarStyle"></div>
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
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-2 mb-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
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
import { DateRange, Event, YearMonthDay } from "../../Types";
const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
const EVENT_HEIGHT_PX = 10;
import Vue from "vue";
import EventMeta from "./EventMeta.vue";

export default Vue.extend({
  components: { EventMeta },
  props: ["event", "widthPerDay", "startYear", "columnWidth"],
  data() {
    return {
      imageStatus: "not loaded",
      images: [],
      showingMeta: false,
    };
  },
  computed: {
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
      return `margin-left: ${this.getLeftMarginForDate(
        this.event,
        this.event.range.from
      )}px;`;
    },
    photoBarClass(): string {
      let c = "photoBar transition rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        if (COLORS.includes(this.$store.getters.tags[tag])) {
          c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-300 `;
        }
      } else {
        c += `bg-gray-300 `;
      }
      return c;
    },
    eventBarClass(): string {
      let c = "eventBar transition opacity-50 rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        if (COLORS.includes(this.$store.getters.tags[tag])) {
          c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-300 `;
        }
      } else {
        c += `bg-gray-300 `;
      }
      return c;
    },
    barColor(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (
        this.$store.getters.tags[tag] &&
        !COLORS.includes(this.$store.getters.tags[tag])
      ) {
        style += ` background-color: ${this.$store.getters.tags[tag]}`;
      }
      return style;
    },
    eventBarStyle(): string {
      return `width: ${this.getWidthForRange(this.event.range)}px; ${
        this.barColor
      }`;
    },
    photoBarStyle(): string {
      return `width: 10px; ${this.barColor}; top: calc(0.5rem + 1px)`;
    },
  },
  methods: {
    async loadImages() {
      this.imageStatus = "loading";
      const imagesResponse = await fetch(
        `https://k.npkn.net/google-photos/${this.event.event.googlePhotosLink}`
      );
      this.images = await imagesResponse.json();
      this.imageStatus = "loaded";
    },
    togglePhotos() {
      this.showingMeta = !this.showingMeta;
      if (this.imageStatus === "not loaded" && this.hasImages) {
        this.loadImages();
      }
    },
    getWidthForRange(range: DateRange): number {
      const width = Math.max(
        EVENT_HEIGHT_PX,
        Math.max(1, range.numDays()) * this.widthPerDay
      );
      return width;
    },
    getLeftMarginForDate(event: Event, date: YearMonthDay): number {
      let base = (event.startingYear() - this.startYear) * this.columnWidth;
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
  },
});
</script>

<style>
.photoBar {
  width: 10px;
}
</style>