<script setup lang="ts">
import { useIsTouchscreen } from "@/Views/Timeline/composables/useIsTouchscreen";
import { ref } from "vue";
import HoverHint from "./HoverHint.vue";

defineProps<{ selected: boolean; title: string; shortcut?: string }>();

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
    v-on="events"
    class="p-1 border-2 disabled:text-gray-400 dark:disabled:text-gray-500 relative"
    :class="
      selected
        ? 'border-indigo-500 dark:border-indigo-400 rounded text-indigo-800 dark:text-indigo-100'
        : 'border-transparent'
    "
  >
    <slot></slot>
    <HoverHint :hovering="hovering" :title="title" :shortcut="shortcut" />
  </button>
</template>

<style scoped>

</style>
