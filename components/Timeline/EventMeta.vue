<template>
  <div class="flex flex-col items-start">
    <div class="flex flex-row" v-if="supplemental.length">
      <div
        class="bg-gray-900 rounded px-2 py-1 -mx-2 mt-1 shadow-lg flex-shrink-0"
        style="max-width: min(90vw, 600px)"
      >
        <div class="ml-5">
          <p
            :class="{ 'mb-1': index !== supplemental.length - 1 }"
            v-for="(item, index) in supplemental"
            :key="item"
            style="font-size: 80%; font-family: system-ui"
            v-html="toInnerHtml(item)"
          >
          </p>
        </div>
      </div>
    </div>
    <div
      class="bg-gray-900 rounded p-2 -mx-2 inline-flex mt-1 relative shadow-lg"
      style="max-width: 100vw"
      v-if="hasLocations || hasImages"
    >
      <div class="ml-2 mr-3"></div>
      <div class="flex flex-row overflow-x-scroll items-center rounded">
        <template v-if="hasLocations">
          <iframe
            :class="{ 'mr-2': index !== locations.length - 1 || hasImages }"
            class="rounded flex-shrink-0"
            v-for="(location, index) in locations"
            :key="location"
            :src="location"
            style="border: 0"
            loading="lazy"
            width="600"
            height="450"
          ></iframe>
        </template>
        <template v-if="hasImages">
          <a
            :href="photosLink"
            v-for="(image, index) in images"
            :key="image"
            :class="{ 'mr-2': index !== images.length - 1 }"
            target="_blank"
          >
            <img :src="image" class="rounded max-w-none z-30"
          /></a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventDescription } from "../../src/Types"

export default Vue.extend({
  props: ["locations", "images", "supplemental", "photosLink"],
  computed: {
    hasImages(): boolean {
      return this.images && this.images.length > 0;
    },
    hasLocations(): boolean {
      return this.locations.length > 0;
    },
  },
  methods: {
    toInnerHtml(s: string): string {
      return EventDescription.toInnerHtml(s)
    }
  }
});
</script>

<style>
</style>