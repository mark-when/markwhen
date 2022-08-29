<script setup lang="ts">
import { useEventDetailResize } from "./composables/useEventDetailResize";
import { useEventDetailStore } from "./eventDetailStore";
import EventDetail from "./EventDetail.vue";
import EventGroupDetail from "./EventGroupDetail.vue";
import { Event, type EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import EventDetailPaneTop from "./EventDetailPaneTop.vue";

const eventDetailStore = useEventDetailStore();

const { resizeMouseDown, tempWidth } = useEventDetailResize();

const close = eventDetailStore.toggle;

const isEvent = computed(() => eventDetailStore.detailEvent instanceof Event);
</script>

<template>
  <div class="flex flex-row">
    <div
      class="flex items-center justify-center relative"
      @mousedown.prevent="resizeMouseDown"
      @touchstart.prevent="resizeMouseDown"
      :style="`cursor: ew-resize; order: ${
        eventDetailStore.isLeft ? '-1' : '1'
      }`"
    >
      <svg
        class="w-3 h-3"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        style="margin-left: -2px; margin-right: -2px"
      >
        <path
          d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
      <div
        v-if="false && eventDetailStore.detailEvent"
        class="absolute w-[2px] top-0 bottom-0 left-[2px] bg-purple-500"
        style="z-index: -1; transform: translateX(50%)"
      ></div>
    </div>
    <div :style="`width: ${tempWidth ? tempWidth : eventDetailStore.width}px;`">
      <EventDetailPaneTop />
      <template v-if="eventDetailStore.detailEvent">
        <EventDetail
          v-if="isEvent"
          :hide-parent-group="false"
          :event="(eventDetailStore.detailEvent as Event)"
        />
        <EventGroupDetail
          v-else
          :eventGroup="(eventDetailStore.detailEvent as EventSubGroup)"
        />
      </template>
      <div
        class="flex flex-row w-full h-full items-center justify-center text-gray-400 dark:text-gray-500"
        v-else
      >
        No event selected
      </div>
    </div>
  </div>
</template>

<style scoped></style>
