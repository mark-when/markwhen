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
  components: { EventRow, DrawerHeader, EventGroup },
  computed: {
    now(): DateTime {
      return DateTime.now();
    },
    shouldShowNow(): boolean {
      if (this.$store.state.sidebar.hideNowLine) {
        return false
      }
      return (
        this.now > (this.baselineLeftmostDate as DateTime) &&
        this.now < (this.baselineRightmostDate as DateTime)
      );
    },
    ...mapGetters([
      "distanceBetweenBaselineDates",
      "filteredEvents",
      "distanceFromBaselineLeftmostDate",
      "baselineLeftmostDate",
      "baselineRightmostDate",
    ]),
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