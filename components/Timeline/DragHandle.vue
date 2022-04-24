<template>
  <div
    class="
      absolute
      flex
      items-center
      justify-center
      cursor-ew-resize
      touch-none
      top-0
      bottom-0
      z-10
    "
    :class="isLeft ? `left-0 ` : `right-0`"
    @touchstart="startResize"
    @mousedown.prevent.stop="startResize"
  >
    <div class="w-4 h-4 absolute flex items-center justify-center">
      <div
        class="
          w-2
          h-2
          rounded-full
          border border-white
          dark:border-gray-400
          bg-gray-600
          dark:bg-gray-900
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["isLeft"],
  methods: {
    startResize(e: TouchEvent | MouseEvent) {
      this.$emit("startResize", e);
    },
  },
});
</script>

<style>
</style>