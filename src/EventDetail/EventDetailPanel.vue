<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";
import EventDetail from "./EventDetail.vue";
import EventGroupDetail from "./EventGroupDetail.vue";
import { Event, type EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed, onMounted, ref, watch } from "vue";
import EventDetailPaneTop from "./EventDetailPaneTop.vue";
import { usePanelResize } from "@/Sidebar/composables/usePanelResize";
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";
import { usePanelMove } from "@/Panels/composables/usePanelMove";

const panelStore = usePanelStore();
const eventDetailStore = useEventDetailStore();

const isLeft = computed(
  () => panelState.value.order < panelStore.visualizationPanelState.order
);
const borderClass = computed(() => {
  const ourOrder = panelState.value.order;
  const visOrder = panelStore.visualizationPanelState.order;
  if (ourOrder === visOrder - 1) {
    return "border-r";
  }
  if (ourOrder === visOrder + 1) {
    return "border-l";
  }
  return "";
});
const { resizeMouseDown, tempWidth } = usePanelResize(
  isLeft,
  computed(() => panelStore.detailPanelState.width || 450),
  (width) => panelStore.setWidth(PanelDetail, width)
);

const isEvent = computed(() => eventDetailStore.detailEvent instanceof Event);
const panelState = computed(() => panelStore.detailPanelState);

const computedOrder = computed(() => {
  return panelState.value.order === 0 ? -2 : 2;
});
const panel = ref();
const { translateX, moveListener } = usePanelMove(panel, () =>
  panelStore.doneMoving()
);

const computedStyle = computed(() => {
  if (translateX.value !== 0) {
    return { transform: `translateX(${translateX.value}px)`, zIndex: 20 };
  }
  const givenTranslation = panelStore.detailPanelState.translation;
  if (givenTranslation) {
    return {
      transform: `translateX(${givenTranslation}px)`,
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  } else if (panelStore.isMoving) {
    return {
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  }
  return {
    transform: `translateX(0px)`,
  };
});

onMounted(() => {
  panelStore.setPanelElement(PanelDetail, panel.value);
});

watch(translateX, (val) => val && panelStore.moving(PanelDetail, val));
</script>

<template>
  <div
    ref="panel"
    class="hidden md:h-full lg:flex flex-shrink-0 flex-col md:flex-row border-slate-200 dark:border-slate-600 z-10 pb-4 md:pb-0 bg-slate-50 dark:bg-slate-800 text-zinc-600 dark:text-zinc-200 transition transition-shadow"
    :class="`${borderClass} ${!!translateX ? 'shadow-xl' : ''}`"
    :style="{
      order: computedOrder,
      ...computedStyle,
    }"
  >
    <div
      class="flex items-center justify-center relative transition hover:bg-gray-200 dark:hover:bg-gray-600"
      @mousedown.prevent="resizeMouseDown"
      @touchstart.prevent="resizeMouseDown"
      :style="`cursor: ew-resize; order: ${isLeft ? 1 : -1}`"
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
    <div
      class="flex flex-col"
      :style="`width: ${
        tempWidth ? tempWidth : panelStore.detailPanelState.width
      }px;`"
    >
      <EventDetailPaneTop :moveListener="moveListener" :left="isLeft" />
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
        class="flex flex-row w-full h-full items-center justify-center text-gray-400 text-sm font-bold dark:text-gray-500"
        v-else
      >
        No event selected
      </div>
    </div>
  </div>
</template>

<style scoped></style>
