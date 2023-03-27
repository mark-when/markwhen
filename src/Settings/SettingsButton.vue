<script setup lang="ts">
import HoverHint from "@/Drawer/HoverHint.vue";
import { computed, ref } from "vue";
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";

defineProps<{
  hoverHintTitle?: string;
  hoverHintShortcut?: string;
  hoverHintLeft?: number;
}>();
const emit = defineEmits<{ (event: "click"): void }>();

const hovering = ref(false);
const { canHover } = useIsTouchscreen();

const events = computed(() =>
  canHover.value
    ? {
        mouseover: () => {
          hovering.value = true;
        },
        mouseleave: () => {
          hovering.value = false;
        },
      }
    : {}
);

const click = () => {
  hovering.value = false;
  emit("click");
};
</script>

<template>
  <button
    @click="click"
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
      :left="hoverHintLeft"
    />
    <slot v-else name="hover" :hovering="hovering"></slot>
  </button>
</template>

<style scoped></style>
