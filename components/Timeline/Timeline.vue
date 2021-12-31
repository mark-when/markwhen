<template>
  <div class="relative h-full overflow-auto w-full">
    <events :years="years" :columnWidth="columnWidth" />
    <drawer-header :edittable="edittable"/>
  </div>
</template>

<script lang="ts">
import { BoundingYears } from "../../Types";
import Events from "./Events.vue";
import Vue from "vue";
import Years from "./Years.vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";

/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 */

export default Vue.extend({
  components: { Events, Years, DrawerHeader },
  props: ['edittable'],
  computed: {
    columnWidth(): number {
      return this.$store.state.settings.yearWidth;
    },
    years(): BoundingYears {
      const events = this.$store.getters.events;

      if (!events || events.length === 0) {
        return { start: 2010, end: 2020 };
      }

      let min = events[0].startingYear();
      let max = events[0].getNextYear();
      for (let event of events) {
        if (event.startingYear() < min) {
          min = event.startingYear();
        }
        if (event.getNextYear() > max) {
          max = event.getNextYear();
        }
      }
      return {
        start: min - 1,
        end: max + 2 + Math.floor(5 * (100 / this.columnWidth)),
      };
    },
    numColumns(): number {
      return this.years.end - this.years.start;
    },
  },
});
</script>

<style>
</style>