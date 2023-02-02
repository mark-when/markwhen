<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";
import EventDetail from "./EventDetail.vue";
import EventGroupDetail from "./EventGroupDetail.vue";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed, onMounted, ref, watch } from "vue";
import EventDetailPaneTop from "./EventDetailPaneTop.vue";
import { usePanelResize } from "@/Sidebar/composables/usePanelResize";
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";
import { usePanelMove } from "@/Panels/composables/usePanelMove";
import type { NodeArray, Node } from "@markwhen/parser/lib/Node";
import { isEventNode } from "@markwhen/parser/lib/Noder";
import ResizeBar from "@/Panels/ResizeBar.vue";

const panelStore = usePanelStore();
const eventDetailStore = useEventDetailStore();

const isLeft = computed(
  () => panelState.value.order < panelStore.visualizationPanelState.order
);
const { resizeMouseDown, tempWidth } = usePanelResize(
  isLeft,
  computed(() => panelStore.detailPanelState.width || 450),
  (width) => panelStore.setWidth(PanelDetail, width)
);

const isEvent = computed(
  () =>
    eventDetailStore.detailEvent && isEventNode(eventDetailStore.detailEvent)
);
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
    class="hidden md:h-full lg:flex flex-shrink-0 flex-col md:flex-row z-10 pb-4 md:pb-0 bg-slate-50 dark:bg-slate-800 text-zinc-600 dark:text-zinc-200 transition transition-shadow border-slate-200 dark:border-slate-600"
    :class="{
      'shadow-xl': !!translateX,
      'border-r': isLeft,
      'border-l': !isLeft,
    }"
    :style="{
      order: computedOrder,
      ...computedStyle,
    }"
  >
    <ResizeBar :resize-mouse-down="resizeMouseDown" :is-left="isLeft" />
    <div
      class="flex flex-col"
      :style="`width: ${
        tempWidth ? tempWidth : panelStore.detailPanelState.width
      }px;`"
    >
      <EventDetailPaneTop :moveListener="moveListener" :left="isLeft" />
      <template v-if="eventDetailStore.detailEvent">
        <EventDetail v-if="isEvent" :hide-parent-group="false" />
        <EventGroupDetail
          v-else
          :eventGroup="(eventDetailStore.detailEvent as Node<NodeArray>)"
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
