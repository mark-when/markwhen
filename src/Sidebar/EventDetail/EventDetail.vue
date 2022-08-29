<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";
import { computed } from "vue";
import EventDetailTags from "./EventDetailTags.vue";
import EventDetailWhen from "./EventDetailWhen.vue";
import EventDetailMarkdown from "./EventDetailMarkdown.vue";
import type { Event, EventSubGroup } from "@markwhen/parser/lib/Types";
import { useTransformStore } from "@/Markwhen/transformStore";

const props = defineProps<{ event: Event; hideParentGroup: boolean }>();

const eventDetailStore = useEventDetailStore();
const transformStore = useTransformStore();

const detailEventPath = computed(() => eventDetailStore.detailEventPath);
const parentPath = computed(() =>
  detailEventPath.value.length === 2 ? [detailEventPath.value[0]] : undefined
);
const parentGroup = computed(() => {
  if (props.hideParentGroup || !parentPath.value) {
    return;
  }
  return transformStore.eventOrGroupFromPath(parentPath.value) as EventSubGroup;
});

const selectParent = () =>
  parentPath.value && eventDetailStore.setDetailEventPath(parentPath.value);
</script>

<template>
  <div class="py-2">
    <div class="flex flex-col pb-3">
      <div class="font-bold text-xl px-3" v-html="event?.getInnerHtml()"></div>
      <div class="flex flex-row px-3">
        <button
          class="font-bold text-sm dark:text-gray-400 text-gray-500 flex flex-row items-center"
          v-if="parentGroup"
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
    <EventDetailWhen :event="event" />
    <EventDetailTags :event="event" />
    <EventDetailMarkdown :event="event" />
  </div>
</template>

<style scoped></style>
