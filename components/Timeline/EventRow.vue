<template>
  <div
    class="eventRow relative"
    :style="eventRowStyle"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
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
          'dark:hover:bg-gray-800 hover:bg-slate-100 hover:shadow-lg': hasMeta,
          'dark:bg-gray-900 bg-slate-100 shadow-lg': showingMeta,
          'cursor-pointer': hasMeta,
        }"
        v-on="hasMeta ? { click: togglePhotos } : {}"
      >
        <event-bar :event="event" :hovering="hovering" />
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
import { DateRange } from "../../src/Types";
import Vue from "vue";
import EventMeta from "./EventMeta.vue";
import { mapGetters } from "vuex";
import EventBar from "./EventBar.vue";

export const EVENT_HEIGHT_PX = 10;

export default Vue.extend({
  components: { EventMeta, EventBar },
  props: ["event"],
  data() {
    return {
      imageStatus: "not loaded",
      images: [],
      showingMeta: false,
      hovering: false,
    };
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
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
        this.event.range.fromDateTime
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