<template>
  <div class="relative h-full overflow-auto" :style="containerStyle">
    <events :years="years" :columnWidth="columnWidth" />
  </div>
</template>

<script lang="ts">
import { BoundingYears } from "../../Types";
import Events from "./Events.vue";
import Vue from "vue";
import Years from "./Years.vue";

/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 * If a user specifies a different color, use that.
 */

export default Vue.extend({
  components: { Events, Years },
  data() {
    return {
      pinchDelta: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    // pinch(a) {
    //   const delta = { x: a.deltaX, y: a.deltaY }
    //   console.log(delta);
    //   this.pinchDelta.x = this.pinchDelta.x - a.deltaX
    //   this.pinchDelta.y = this.pinchDelta.y - a.deltaY
    //   this.$store.commit('setYearWidth', this.$store.state.settings.yearWidth + a.deltaX)
    // },
  },
  computed: {
    containerStyle(): string {
      return ''
      // return `width: ${this.columnWidth * this.numColumns}px;`;
    },
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