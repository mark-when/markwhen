<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${distanceBetweenBaselineDates}px;`"
  >
    <div class="h-24"></div>
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

export default Vue.extend({
  components: { EventRow, DrawerHeader, EventGroup },
  computed: {
    ...mapGetters(["distanceBetweenBaselineDates", "filteredEvents"]),
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