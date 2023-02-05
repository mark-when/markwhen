<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";
import { computed, watch } from "vue";
import EventDetailTags from "./EventDetailTags.vue";
import EventDetailWhen from "./EventDetailWhen.vue";
import EventDetailMarkdown from "./EventDetailMarkdown.vue";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import { useEventFinder } from "@/Views/ViewOrchestrator/useEventFinder";
import { useEventRefs } from "@/Markwhen/composables/useEventRefs";
import { eventValue, isEventNode } from "@markwhen/parser/lib/Noder";
import type { EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";

const props = defineProps<{ hideParentGroup: boolean }>();

const eventDetailStore = useEventDetailStore();

const detailEventPath = computed(() => eventDetailStore.detailEventPath);
const eventNode = useEventFinder(detailEventPath);
const event = computed<Event | undefined>(
  () =>
    (eventNode.value &&
      isEventNode(eventNode.value) &&
      eventValue(eventNode.value)) ||
    undefined
);
const parentPath = computed(() => {
  if (detailEventPath.value && detailEventPath.value.path.length > 1) {
    return {
      type: detailEventPath.value.type,
      path: detailEventPath.value.path.slice(0, -1),
    } as EventPath;
  }
});
const parentGroup = useEventFinder(parentPath);

const selectParent = () =>
  parentPath.value && eventDetailStore.setDetailEventPath(parentPath.value);

const {
  eventRange,
  eventLocations,
  supplemental,
  percent,
  matchedListItems,
  tags,
  color,
  dateText,
  titleHtml,
} = useEventRefs(
  event,
  () => (eventNode.value && isEventNode(eventNode.value)) || false
);

const range = computed(() => toDateRange(eventRange.value!));
</script>

<template>
  <div class="py-2 flex flex-col overflow-hidden">
    <div class="flex flex-col pb-3">
      <div class="font-bold text-xl px-3" v-html="titleHtml"></div>
      <div class="flex flex-row px-3">
        <button
          class="font-bold text-sm dark:text-gray-400 text-gray-500 flex flex-row items-center"
          v-if="parentGroup && !hideParentGroup"
          @click="selectParent"
        >
          {{
            parentGroup.title ||
            (parentGroup.style === "group" ? "(Group)" : "(Section)")
          }}<span>
            <svg
              class="w-4 h-4"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <EventDetailWhen :date-html="dateText!" :date-range="range" />
    <EventDetailTags :tags="tags || []" />
    <EventDetailMarkdown
      :markdown-blocks="supplemental || []"
      :matched-list-items="matchedListItems || []"
    />
  </div>
</template>

<style scoped></style>
