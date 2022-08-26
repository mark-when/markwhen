<script setup lang="ts">
import { useSidebarResize } from "./composables/useSidebarResize";
import { useSidebarStore } from "./sidebarStore";
import SidebarComponentSelector from "./SidebarComponentSelector.vue";
import SidebarVisibility from "./SidebarVisibility.vue";
import SidebarLinks from "./SidebarLinks.vue";
import EventDetailPane from "./EventDetail/EventDetailPane.vue";
import { useEventDetailStore } from "./EventDetail/eventDetailStore";
import ViewSwitcher from "../Drawer/ViewSwitcher.vue";

const sidebarStore = useSidebarStore();
const eventDetailStore = useEventDetailStore();

const { tempWidth, resizeMouseDown } = useSidebarResize();
</script>

<template>
  <div
    class="hidden md:h-full overflow-y-auto flex-shrink-0 md:flex flex-col md:flex-row border-gray-600 z-10 pb-4 md:pb-0 bg-slate-50 dark:bg-slate-800 order-2 text-zinc-600 dark:text-zinc-200"
    :class="{
      'md:order-2': !sidebarStore.isLeft,
      'md:order-1': sidebarStore.isLeft,
      sidebar: !sidebarStore.selectedComponent,
    }"
    style="-webkit-transform: translate3d(0, 0, 0); overflow: visible"
  >
    <div
      class="flex flex-col justify-center md:justify-end md:mb-10 order-2"
      :class="{
        'md:order-1': sidebarStore.isLeft,
        'md:order-2': !sidebarStore.isLeft,
      }"
    >
      <div class="top flex-grow flex flex-col">
        <SidebarVisibility />
      </div>
      <div class="middle flex-grow flex flex-col items-center justify-center">
        <ViewSwitcher />
      </div>
      <div class="bottom flex-grow flex flex-col justify-end">
        <SidebarComponentSelector />
        <SidebarLinks />
      </div>
    </div>
    <div
      v-show="!!sidebarStore.selectedComponent"
      class="order-1 hidden md:flex"
      :class="{
        'md:order-1': !sidebarStore.isLeft,
        'md:order-2': sidebarStore.isLeft,
      }"
      :style="`width: ${tempWidth ? tempWidth : sidebarStore.width}px;`"
    >
      <!-- <keep-alive>
        <component :is="selectedComponentComponent" />
      </keep-alive> -->
      <div
        class="flex items-center justify-center relative"
        @mousedown.prevent="resizeMouseDown"
        @touchstart.prevent="resizeMouseDown"
        :style="`cursor: ew-resize; order: ${sidebarStore.isLeft ? '1' : '-1'}`"
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
          v-if="false"
          class="absolute w-[2px] top-0 bottom-0 left-[2px] bg-red-500"
          style="z-index: -1; transform: translateX(50%)"
        ></div>
      </div>
    </div>
    <EventDetailPane
      v-if="eventDetailStore.visible"
      :class="{
        'order-0': eventDetailStore.isLeft,
        'order-3': !eventDetailStore.isLeft,
      }"
    />
  </div>
</template>

<style scoped></style>
