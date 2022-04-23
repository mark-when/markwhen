<template>
  <div
    class="
      flex flex-row
      text-gray-500
      dark:text-gray-400
      absolute
      pr-8
      moveWidgets
      top-0
      bottom-0
      items-center
      justify-center
    "
    :style="style"
  >
    <div
      class="flex flex-row mr-1 items-center justify-center"
      v-if="sort === 'none'"
    >
      <button
        class="transition hover:bg-slate-200 dark:hover:bg-slate-800 rounded-sm"
        @click="$emit('moveUp')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        class="transition hover:bg-slate-200 dark:hover:bg-slate-800 rounded-sm"
        @click="$emit('moveDown')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      class="
        handle
        flex
        items-center
        justify-center
        cursor-crosshair
        touch-none
      "
      @touchstart="move"
      @mousedown.prevent.stop="move"
    >
      <svg
        class="w-4 h-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  computed: {
    ...mapState(["sort"]),
    style(): string {
      return this.sort === "none" ? "left: -4rem" : "left: -1.8rem;";
    },
  },
  methods: {
    move(e: MouseEvent | TouchEvent) {
      this.$emit("move", e);
    },
  },
});
</script>

<style>
.moveWidgets {
  display: inline-flex;
}
</style>