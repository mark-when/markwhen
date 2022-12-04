<script setup lang="ts">
import { computed } from "vue";
import { useEventDetailStore } from "./eventDetailStore";
import PanelViewButtons from "../Panels/PanelViewButtons.vue";
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";

const eventDetailStore = useEventDetailStore();
const panelStore = usePanelStore();
const props = defineProps<{
  moveListener: (e: MouseEvent | TouchEvent) => void;
  left: boolean;
}>();

const close = () =>
  panelStore.setVisibility(PanelDetail, !panelStore.detailPanelState.visible);

const hasPrev = computed(() => eventDetailStore.prev);
const hasNext = computed(() => eventDetailStore.next);

const selectPrev = () =>
  eventDetailStore.setDetailEventPath(eventDetailStore.prev!);
const selectNext = () =>
  eventDetailStore.setDetailEventPath(eventDetailStore.next!);
</script>

<template>
  <div
    class="flex flex-row relative"
    :class="{
      'justify-end': !eventDetailStore.detailEvent && left,
    }"
  >
    <PanelViewButtons
      :move-listener="props.moveListener"
      :left="left"
      @close="close"
      :fill="false"
    />
    <div
      class="flex-grow flex flex-row items-center justify-center"
      v-if="eventDetailStore.detailEvent"
      :class="{
        'order-1': left,
        'order-2': !left,
      }"
    >
      <div class="flex flex-row items-center md:mt-1">
        <button
          :disabled="!hasPrev"
          class="uppercase font-bold text-xs enabled:hover:bg-slate-200 enabled:dark:hover:bg-slate-700 flex flex-row items-center p-1 disabled:dark:text-gray-500 disabled:text-gray-400"
          style="line-height: initial"
          @click="selectPrev"
        >
          <div class="flex flex-row items-center">
            <span
              ><svg
                class="w-3 h-3"
                focusable="false"
                aria-hidden="true"
                viewBox="0 1 24 24"
                fill="currentColor"
              >
                <path
                  d="M14.71 6.71a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z"
                ></path></svg></span
            ><span>Prev</span>
          </div>
          <div
            class="h-3 w-3 rounded flex bg-gray-200 dark:bg-gray-600 flex ml-1"
            style="justify-content: center; align-items: end"
          >
            <span>,</span>
          </div>
        </button>
        <div class="w-px"></div>
        <button
          :disabled="!hasNext"
          class="uppercase font-bold text-xs enabled:hover:bg-slate-200 enabled:dark:hover:bg-slate-700 flex flex-row items-center p-1 disabled:dark:text-gray-500 disabled:text-gray-400"
          style="line-height: initial"
          @click="selectNext"
        >
          <div
            class="h-3 w-3 rounded flex bg-gray-200 flex mr-1 dark:bg-gray-600"
            style="justify-content: center; align-items: end"
          >
            <span>.</span>
          </div>
          <span>next</span
          ><span
            ><svg
              class="w-3 h-3"
              focusable="false"
              aria-hidden="true"
              viewBox="0 1 24 24"
              fill="currentColor"
            >
              <path
                d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"
              ></path></svg
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
