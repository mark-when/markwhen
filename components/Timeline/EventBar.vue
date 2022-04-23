
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition"
      :class="percentBarColorClass"
      :style="`min-width: 10px; max-width: 100%; ${percentBarColorStyle}; width: ${percent}%;`"
    ></div>
    <div
      v-if="$store.state.edittable && hovering"
      class="
        absolute
        top-0
        left-0
        bottom-0
        flex
        items-center
        justify-center
        dark:text-gray-300
        text-gray-500
        cursor-ew-resize
        touch-none
      "
      @touchstart="startResizeLeft"
      @mousedown.prevent.stop="startResizeLeft"
    >
      <div
        class="
          w-2
          h-2
          rounded
          border border-white
          dark:border-gray-400
          bg-gray-600
          dark:bg-gray-900
          absolute
        "
      ></div>
      <!-- <svg
        class="w-2 h-2 absolute"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="8"></circle>
      </svg> -->
    </div>
    <div
      v-if="$store.state.edittable && hovering"
      class="
        absolute
        top-0
        bottom-0
        right-0
        flex
        items-center
        justify-center
        dark:text-gray-300
        text-black
        cursor-ew-resize
        touch-none
      "
      @touchstart="startResizeRight"
      @mousedown.prevent.stop="startResizeRight"
    >
      <div
        class="
          w-2
          h-2
          rounded
          border border-white
          dark:border-gray-400
          bg-gray-600
          dark:bg-gray-900
          absolute
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Event } from "~/src/Types";
import { mapGetters } from "vuex";

export default Vue.extend({
  props: ["event", "hovering", "width"],
  methods: {
    startResizeLeft(e: MouseEvent) {
      console.log("startResizeLeft");
      this.$emit("startResizeLeft", e);
    },
    startResizeRight(e: MouseEvent) {
      console.log("startResizeRight");
      this.$emit("startResizeRight", e);
    },
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
    tagColor(): string | undefined {
      if (this.event.event.tags[0]) {
        return this.$store.getters.tags[this.event.event.tags[0]];
      }
      return undefined;
    },
    percent(): number | undefined {
      return (this.event as Event).event.percent || 100;
    },
    percentBarColorClass(): string {
      let c = "";
      if (!this.tagColor) {
        c += `dark:bg-gray-400 bg-slate-700 `;
      }
      if (this.hovering) {
        c += "opacity-100 shadow-lg ";
      } else {
        c += "opacity-60 ";
      }
      return c;
    },
    percentBarColorStyle(): string {
      let style = "";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.8)`;
      }
      return style;
    },
    eventBarClass(): string {
      let c = "eventBar transition rounded-lg shadow ";
      if (!this.tagColor) {
        c += `dark:bg-slate-400 bg-slate-700 opacity-30 `;
      }
      return c;
    },
    barColorStyle(): string {
      let style = "";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.3)`;
      }
      return style;
    },
    eventBarStyle(): string {
      return `width: ${this.width}px; ${this.barColorStyle}`;
    },
  },
});
</script>

<style>
.eventBar {
  border-radius: 5px;
  height: 10px;
  flex-shrink: 0;
}
</style>