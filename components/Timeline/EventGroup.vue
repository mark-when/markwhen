<template>
  <div v-if="expanded" class="relative">
    <div
      class="
        absolute
        h-full
        flex flex-row
        items-center
        text-gray-400
        bg-gray-800 bg-opacity-40
        rounded-lg
        my-2
      "
      :style="`left: ${left - 20}px; width: max(84px, ${
        this.fullWidth + 20
      }px)`"
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
    </div>
    <event-row
      v-for="event in events"
      :key="event.eventString.substring(0, 30)"
      :event="event"
    ></event-row>
  </div>
  <div
    v-else
    :style="groupStyle"
    class="text-gray-400 bg-gray-800 bg-opacity-50 rounded-full text-sm"
  >
    <button class="w-full" @click="expand">+{{ events.length }}</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EventRow from "./EventRow.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { EventRow },
  props: ["events"],
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate", "distanceBetweenDates"]),
    groupStyle(): string {
      const leftMargin = this.left;
      return `margin-left: ${leftMargin}px; width: max(64px, ${this.fullWidth}px)`;
    },
    left(): number {
      return this.distanceFromBaselineLeftmostDate(
        this.events[0].range.fromDateTime
      );
    },
    fullWidth(): number {
      return this.distanceBetweenDates(
        this.events[0].range.fromDateTime,
        this.events[this.events.length - 1].range.toDateTime
      );
    },
  },
  methods: {
    expand() {
      this.expanded = true;
    },
  },
});
</script>

<style>
</style>