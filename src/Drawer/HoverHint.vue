<script setup lang="ts">
import ShortcutKey from "./ShortcutKey.vue";

export type HoverPosition = "right" | "top";

const props = withDefaults(
  defineProps<{
    hovering: boolean;
    title: string;
    shortcut?: string;
    hoverPosition?: HoverPosition;
    left?: number;
  }>(),
  {
    hoverPosition: "right",
    left: 0,
  }
);
</script>

<template>
  <transition>
    <div
      class="hintRight absolute -right-2 top-0 bottom-0 whitespace-nowrap flex items-center justify-center ml-2 bg-indigo-600 shadow-lg rounded px-2 font-bold text-white pointer-events-none"
      style="transform: translateX(100%)"
      v-if="hovering && hoverPosition === 'right'"
    >
      <div class="z-10">
        <div v-if="title">{{ title }}</div>
        <slot v-else></slot>
      </div>
      <ShortcutKey :keyboardKey="shortcut" v-if="shortcut" />

      <div
        class="absolute top-0 bottom-0 -left-[2px] rotate-45 bg-indigo-600 h-1/2 aspect-square translate-y-2/4 rounded shadow-sm"
      ></div>
    </div>
    <div
      class="hintTop absolute -top-1 whitespace-nowrap flex items-center justify-center mb-2 bg-indigo-600 shadow-lg rounded px-2 font-bold text-white pointer-events-none"
      :style="{
        transform: `translateY(-100%)`,
        left: `${left ? left : 2}px`,
      }"
      v-else-if="hovering && hoverPosition === 'top'"
    >
      <div class="z-10">
        <div v-if="title">{{ title }}</div>
        <slot v-else></slot>
      </div>
      <ShortcutKey :keyboardKey="shortcut" v-if="shortcut" />
      <div
        class="absolute left-0 -bottom-[2px] rotate-45 bg-indigo-600 h-1/2 aspect-square translate-x-2/4 rounded shadow-sm"
      ></div>
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
