<script setup lang="ts">
import { useEventDetailResize } from "./composables/useEventDetailResize";
import { useEventDetailStore } from "./eventDetailStore";
import EventDetail from "./EventDetail.vue";

const eventDetailStore = useEventDetailStore();

const { resizeMouseDown, tempWidth } = useEventDetailResize();

const close = eventDetailStore.toggle;
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
      <div
        class="flex flex-row"
        :class="{ 'justify-end': !eventDetailStore.isLeft }"
      >
        <button
          role="button"
          title="Close/collapse sidebar"
          @click="close"
          class="transition p-2 md:mt-1 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <EventDetail v-if="eventDetailStore.detailEvent" />
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
