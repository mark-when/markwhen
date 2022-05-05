<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${distanceBetweenBaselineDates}px;`"
  >
    <div class="h-24"></div>
    <div
      v-if="shouldShowNow"
      class="absolute h-full dark:bg-slate-400 bg-blue-300"
      :style="`width: 1px; left: ${distanceFromBaselineLeftmostDate(now)}px`"
    ></div>
    <template v-for="event in filteredEvents">
      <template v-if="Array.isArray(event)">
        <event-group
          :key="
            event.length ? event[0].eventString.substring(0, 50) : 'newGroup'
          "
          :eventGroup="event"
        />
      </template>
      <event-row
        v-else
        :key="event.eventString.substring(0, 50)"
        :event="event"
      ></event-row
    ></template>
    <div class="w-full relative h-3 mt-1">
      <button
        class="
          h-3
          rounded-full
          border
          flex
          items-center
          justify-center
          flex-shrink-0
          relative
          border-white
          bg-white
          border-slate-600
          text-slate-600
          hover:bg-blue-50
          border-blue-100
          opacity-60
          shadow
          hover:opacity-100
          dark:text-slate-100
          dark:bg-slate-500
          dark:hover:bg-slate-600
          dark:border-slate-100
          text-sm
        "
        :style="`left: ${newEventPosition[0]}px; width: ${
          newEventPosition[1] - newEventPosition[0]
        }px;`"
        @mousedown.prevent="$emit('startMakingEvent', $event)"
      >
        +
      </button>
    </div>
    <div style="height: 90vh"></div>
  </div>
</template>

<script lang="ts">
import EventRow from "./EventRow.vue";
import Vue from "vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
import { mapGetters } from "vuex";
import EventGroup from "./EventGroup/EventGroup.vue";
import { DateTime } from "luxon";

export default Vue.extend({
  props: ["mouseLeft"],
  components: { EventRow, DrawerHeader, EventGroup },
  computed: {
    newEventPosition(): [number, number] {
      return this.rangeFromOffsetLeft(this.mouseLeft);
    },
    now(): DateTime {
      return DateTime.now();
    },
    shouldShowNow(): boolean {
      if (this.$store.state.sidebar.hideNowLine) {
        return false;
      }
      return (
        this.now > (this.baselineLeftmostDate as DateTime) &&
        this.now < (this.baselineRightmostDate as DateTime)
      );
    },
    ...mapGetters([
      "rangeFromOffsetLeft",
      "distanceBetweenBaselineDates",
      "filteredEvents",
      "distanceFromBaselineLeftmostDate",
      "baselineLeftmostDate",
      "baselineRightmostDate",
    ]),
  },
  methods: {
    clic() {
      console.log("click");
    },
  },
});
</script>

<style>
/* appearing */
.eventRow-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.eventRow-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
}

/* appear at / disappear to */
.eventRow-enter-from,
.eventRow-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
}
</style>