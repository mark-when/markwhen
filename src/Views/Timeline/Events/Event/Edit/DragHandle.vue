<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  isLeft: boolean;
  left?: number;
  mouseDownTouchStartListener: (e: MouseEvent | TouchEvent) => void;
}>();

const styleObj = computed(() => {
  if (props.left) {
    return { left: `${props.left}px` };
  }
  if (props.isLeft) {
    return { left: "0px" };
  }
  return { right: "0px" };
});
</script>

<template>
  <div
    class="absolute flex items-center justify-center cursor-ew-resize touch-none top-0 bottom-0 z-10"
    :style="styleObj"
    @touchstart.passive="mouseDownTouchStartListener"
    @mousedown.prevent.stop="mouseDownTouchStartListener"
  >
    <div
      class="absolute w-[2px] h-4 bg-gray-600 rounded dark:bg-gray-300"
    ></div>
    <div class="w-4 h-4 absolute flex items-center justify-center">
      <div
        class="w-2 h-2 rounded-full border border-white dark:border-gray-300 bg-gray-600 dark:bg-gray-900 shadow"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
