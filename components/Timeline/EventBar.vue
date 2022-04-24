
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition"
      :class="percentBarColorClass"
      :style="`min-width: 10px; max-width: 100%; ${percentBarColorStyle}; width: ${percent}%;`"
    ></div>
    <drag-handle
      v-if="$store.state.edittable && hovering"
      @startResize="startResizeLeft"
      :isLeft="true"
    />
    <drag-handle
      v-if="$store.state.edittable && hovering"
      @startResize="startResizeRight"
      :isLeft="false"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Event } from "~/src/Types";
import { mapGetters } from "vuex";
import DragHandle from "./DragHandle.vue";

export default Vue.extend({
  components: { DragHandle },
  props: ["event", "hovering", "width"],
  methods: {
    startResizeLeft(e: MouseEvent) {
      this.$emit("startResizeLeft", e);
    },
    startResizeRight(e: MouseEvent) {
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