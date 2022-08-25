<script setup lang="ts">
import type { Block, Range } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import EventMarkdown from "./EventMarkdown.vue";

const props = defineProps<{
  locations: string[];
  images: string[];
  supplemental: Block[];
  photosLink?: string;
  matchedListItems: Range[];
  left: number;
}>();

const emit = defineEmits<{ (event: "close"): void }>();

const hasImages = computed(() => !!props.images && !!props.images.length);
const hasLocations = computed(() => props.locations.length > 0);
</script>

<template>
  <div class="flex flex-row eventMeta">
    <div class="flex flex-col items-start">
      <div class="flex flex-row cursor-default" v-if="supplemental.length">
        <div
          class="dark:bg-gray-900 bg-white rounded px-2 py-1 -mx-2 mt-1 shadow-lg flex-shrink-0"
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
        class="dark:bg-gray-900 bg-white rounded p-2 -mx-2 inline-flex mt-1 relative shadow-lg"
        style="max-width: 100vw"
        v-if="hasLocations || hasImages"
      >
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
    <div class="ml-3 flex flex-col">
      <button
        class="dark:bg-gray-800 bg-white rounded mt-1 p-1 shadow-lg"
        @click="emit('close')"
      >
        <svg
          class="h-4 w-4"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 14 14"
          data-testid="CloseRoundedIcon"
          tabindex="-1"
          title="CloseRounded"
          fill="currentColor"
        >
          <path
            d="M 10.29 3.7 A 0.9959 0.9959 0 0 0 8.88 3.7 L 7 5.59 L 5.11 3.7 A 0.9959 0.9959 0 0 0 3.7 3.7 C 3.31 4.09 3.31 4.72 3.7 5.11 L 5.59 7 L 3.7 8.89 C 3.31 9.28 3.31 9.91 3.7 10.3 C 4.09 10.69 4.72 10.69 5.11 10.3 L 7 8.41 L 8.89 10.3 C 9.28 10.69 9.91 10.69 10.3 10.3 C 10.69 9.91 10.69 9.28 10.3 8.89 L 8.41 7 L 10.3 5.11 C 10.68 4.73 10.68 4.09 10.29 3.7 Z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
