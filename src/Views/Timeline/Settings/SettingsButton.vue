<script setup lang="ts">
import HoverHint from "@/Drawer/HoverHint.vue";
import { ref } from "vue";
import { useIsTouchscreen } from "../composables/useIsTouchscreen";
import { useTimelineStore } from "../timelineStore";
const timelineStore = useTimelineStore();

defineProps<{ hoverHintTitle?: string; hoverHintShortcut?: string }>();
defineEmits<{ (event: "click"): void }>();

const hovering = ref(false);
const { canHover } = useIsTouchscreen();

const events = canHover.value
  ? {
      mouseover: () => {
        hovering.value = true;
      },
      mouseleave: () => {
        hovering.value = false;
      },
    }
  : {};
</script>

<template>
  <button
    @click="$emit('click')"
    class="h-6 flex flex-row items-center rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 text-sm lg:text-base font-bold relative"
    v-on="events"
  >
    <slot></slot>
    <HoverHint
      v-if="hoverHintTitle"
      :hover-position="'top'"
      :hovering="hovering"
      :title="hoverHintTitle"
      :shortcut="hoverHintShortcut"
    />
  </button>
</template>

<style scoped></style>
