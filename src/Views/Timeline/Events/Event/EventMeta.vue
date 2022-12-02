<script setup lang="ts">
import type { Block, MarkdownBlock, Range } from "@markwhen/parser/lib/Types";
import { computed, watch } from "vue";
import EventMarkdown from "./EventMarkdown.vue";

const props = defineProps<{
  locations: string[];
  supplemental: MarkdownBlock[];
  photosLink?: string;
  matchedListItems: Range[];
  left: number;
}>();

const emit = defineEmits<{ (event: "close"): void }>();

const hasLocations = computed(() => props.locations.length > 0);

const locations = computed(() =>
  props.locations.map(
    (l) =>
      `https://www.google.com/maps/embed/v1/place?key=AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU&q=${l}`
  )
);
</script>

<template>
  <div class="eventMeta flex flex-row ml-2">
    <div class="flex flex-col items-start">
      <div class="flex flex-row cursor-default" v-if="supplemental.length">
        <div
          class="dark:bg-gray-900 bg-white rounded px-2 py-1 -mx-2 mt-px shadow-lg flex-shrink-0 border border-indigo-500/50"
          style="max-width: min(90vw, 600px)"
        >
          <event-markdown
            style="font-size: 80%"
            :supplemental="supplemental"
            :matchedListItems="matchedListItems"
          />
        </div>
      </div>
      <div
        class="dark:bg-gray-900 bg-white rounded p-2 -mx-2 inline-flex mt-px relative shadow-lg border border-indigo-500/75"
        style="max-width: 100vw"
        v-if="hasLocations"
      >
        <div class="flex flex-row overflow-x-scroll items-center rounded">
          <template v-if="hasLocations">
            <iframe
              :class="{ 'mr-2': index !== locations.length - 1 }"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
