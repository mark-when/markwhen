<template>
  <div class="eventRow flex flex-col relative" :style="eventRowStyle">
    <div
      v-if="showingImages"
      :class="photoBarClass"
      class="absolute left-0 mr-2 bottom-2 z-20 opacity-50"
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
          'hover:bg-gray-800 hover:shadow-lg': !!event.event.googlePhotosLink,
          'bg-gray-900 shadow-lg': showingImages,
          'cursor-pointer': !!event.event.googlePhotosLink,
        }"
        v-on="!!event.event.googlePhotosLink ? { click: togglePhotos } : {}"
      >
        <div :class="eventBarClass" :style="eventBarStyle"></div>
        <p class="eventDate">{{ event.getDateHtml() }}</p>
        <svg
          v-if="event.event.googlePhotosLink && imageStatus !== 'loading'"
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
          v-else-if="event.event.googlePhotosLink && imageStatus === 'loading'"
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
        <p class="eventTitle ml-2" v-html="event.getInnerHtml()"></p>
      </div>
    </div>
    <div
      v-if="showingImages && imageStatus === 'loaded' && images.length > 0"
      class="bg-gray-900 rounded p-2 -mx-2 inline-flex mt-1 relative shadow-lg"
      style="max-width: 100vw"
    >
      <div class="ml-2 mr-3"></div>
      <div class="flex flex-row overflow-x-scroll items-center rounded">
        <a
          :href="event.event.googlePhotosLink"
          v-for="(image, index) in images"
          :key="image"
          :class="{ 'mr-2': index !== images.length - 1 }"
        >
          <img :src="image" class="rounded max-w-none z-30"
        /></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateRange, Event, YearMonthDay } from "../Types";
const COLORS = ["green", "blue", "red", "yellow", "indigo", "purple", "pink"];
const EVENT_HEIGHT_PX = 10;
import Vue from "vue";

export default Vue.extend({
  props: ["event", "widthPerDay", "startYear", "columnWidth"],
  data() {
    return {
      imageStatus: "not loaded",
      images: [],
      showingImages: false,
    };
  },
  computed: {
    hasImages(): boolean {
      return !!this.event.event.googlePhotosLink;
    },
    eventRowStyle(): string {
      return `margin-left: ${this.getLeftMarginForDate(
        this.event,
        this.event.range.from
      )}px`;
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
      this.showingImages = !this.showingImages;
      if (this.imageStatus === "not loaded") {
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