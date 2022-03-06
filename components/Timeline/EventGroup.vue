<template>
  <div v-if="expanded" class="relative">
    <div
      class="
        absolute
        h-full
        flex flex-row
        items-center
        text-gray-400
        bg-gray-800
        border border-gray-800
        rounded-lg
        transition
        py-1
      "
      :class="{ 'bg-opacity-10': !hovering, 'bg-opacity-40': hovering }"
      :style="`left: ${left - 10}px; width: ${
        this.fullWidth + 16
      }px; z-index: -1`"
    ></div>
    <button
      class="flex flex-row items-center mt-1"
      :style="`margin-left: ${left}px; width: ${this.fullWidth}px`"
      @mouseover="hovering = true"
      @mouseleave="hovering = false"
      @click="collapse"
    >
      <div class="flex flex-row flex-grow items-center justify-center">
        <p class="eventTitle" v-if="eventGroup.title">{{ eventGroup.title }}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <event-row
      v-for="event in eventGroup"
      :key="event.eventString.substring(0, 30)"
      :event="event"
    ></event-row>
  </div>
  <div
    v-else
    :style="groupStyle"
    class="
      bg-gray-800 bg-opacity-10
      hover:bg-opacity-40
      border border-gray-800
      rounded-lg
      eventTitle
    "
  >
    <button class="w-full" @click="expand">
      <span v-if="eventGroup.title">{{
        eventGroup.title
      }}</span>
      ({{ eventGroup.length }})
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EventRow from "./EventRow.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { EventRow },
  props: ["eventGroup"],
  data() {
    return {
      expanded: !!this.eventGroup.startExpanded,
      hovering: false,
    };
  },
  watch: {
    eventGroup(val, oldVal) {
      if (!Array.isArray(val)) {
        console.log("Not an array", val);
      }
    },
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate", "distanceBetweenDates"]),
    groupStyle(): string {
      const leftMargin = this.left;
      return `margin-left: ${leftMargin - 10}px; width: max(64px, ${
        this.fullWidth + 16
      }px)`;
    },
    left(): number {
      return this.distanceFromBaselineLeftmostDate(this.eventGroup.range.min);
    },
    fullWidth(): number {
      return this.distanceBetweenDates(
        this.eventGroup.range.min,
        this.eventGroup.range.latest
      );
    },
  },
  methods: {
    expand() {
      this.expanded = true;
    },
    collapse() {
      this.expanded = false;
    },
  },
});
</script>

<style>
</style>