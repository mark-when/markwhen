<script setup lang="ts">
import { computed, ref } from "vue";

export type HoverPosition = "right" | "top";

const props = withDefaults(
  defineProps<{
    hovering: boolean;
    title?: string;
    shortcut?: string;
    left?: number;
  }>(),
  {
    hoverPosition: "right",
    left: 0,
  }
);

const selfHover = ref(false);

const mouseover = () => {
  selfHover.value = true;
};

const mouseleave = () => {
  selfHover.value = false;
};

const allToldHovering = computed(() => selfHover.value || props.hovering);
</script>

<template>
  <transition>
    <div
      class="hintTop absolute -top-1 left-0 whitespace-nowrap flex items-center justify-center mb-2 shadow-lg rounded py-1 font-bold text-white"
      :style="{
        transform: `translateY(-100%)`,
      }"
      v-if="allToldHovering"
    >
      <!-- <div
        class="absolute left-0 -bottom-[2px] rotate-45 bg-indigo-600 h-3 aspect-square translate-x-2/4 rounded shadow-sm"
        style="z-index: -1"
      ></div> -->
      <div class="absolute inset-0 bg-slate-800 border-3 border-indigo-600 rounded"></div>
      <div
        class="absolute -inset-2"
        @mouseover="mouseover"
        @mouseleave="mouseleave"
      ></div>
      <div class="z-10">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.hintRight.v-enter-active,
.hintRight.v-leave-active {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  transform: translateX(calc(100%)) !important;
}

.hintRight.v-enter-from,
.hintRight.v-leave-to {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  opacity: 0;
  transform: translateX(calc(100% + 4px)) !important;
}

.hintTop.v-enter-active,
.hintTop.v-leave-active {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  transform: translateY(calc(-100%)) !important;
}

.hintTop.v-enter-from,
.hintTop.v-leave-to {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  opacity: 0;
  transform: translateY(calc(-100% + 4px)) !important;
}
</style>
