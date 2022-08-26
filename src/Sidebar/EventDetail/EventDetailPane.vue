<script setup lang="ts">
import { useEventDetailResize } from "./composables/useEventDetailResize";
import { useEventDetailStore } from "./eventDetailStore";
import EventDetail from "./EventDetail.vue";

const eventDetailStore = useEventDetailStore();

const { resizeMouseDown, tempWidth } = useEventDetailResize();
</script>

<template>
  <div class="flex flex-row">
    <div
      class="flex items-center justify-center"
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
    </div>
    <div
      class=""
      :style="`width: ${tempWidth ? tempWidth : eventDetailStore.width}px;`"
    >
      <EventDetail />
    </div>
  </div>
</template>

<style scoped></style>
