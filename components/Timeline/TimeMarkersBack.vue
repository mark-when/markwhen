<template>
  <div class="fixed inset-0">
    <div class="timeMarkerContainer h-full">
      <div
        class="flex flex-row h-full"
        :style="`margin-left: -${leftMargin}px`"
      >
        <time-marker-back
          v-for="timeMarker in markers"
          :key="timeMarker.ts"
          :opacity="alpha(timeMarker.dateTime)"
          :width="timeMarker.size"
          :borderColor="borderColorForDateTime(timeMarker.dateTime)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeMarkerBack from "./TimeMarkerBack.vue";
import { viewportLeftMarginPixels } from "~/store/index";
import { DateTime } from "luxon";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { TimeMarkerBack },
  props: ["markers"],
  data() {
    return {
      leftMargin: viewportLeftMarginPixels,
    };
  },
  computed: {
    ...mapGetters(["timeMarkerWeights", "sidebar/darkMode"]),
  },
  methods: {
    borderColorForDateTime(dateTime: DateTime): string {
      const isDark = this["sidebar/darkMode"] === 'dark';
      const a = (this.alpha(dateTime) - 0.3) * 2;
      return isDark ? `rgba(111, 111, 111, ${a})` : `rgba(161, 161, 161, ${a})`;
    },
    scaleForDate(dateTime: DateTime): number {
      if (dateTime.second === 0) {
        if (dateTime.minute === 0) {
          if (dateTime.hour === 0) {
            if (dateTime.day === 1) {
              if (dateTime.month === 1) {
                if (dateTime.year % 10 === 0) {
                  return 6;
                }
                return 5;
              }
              return 4;
            }
            return 3;
          }
          return 2;
        }
        return 1;
      }
      return 0;
    },
    alpha(dateTime: DateTime) {
      const a = this.timeMarkerWeights[this.scaleForDate(dateTime)];
      return a;
    },
  },
});
</script>

<style>
.timeMarkerContainer {
  position: sticky;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>