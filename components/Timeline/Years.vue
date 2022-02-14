<template>
  <custom-scroller
    ref="recyclerScroller"
    class="flex absolute inset-0"
    page-mode
    :items="timeMarkers"
    key-field="ts"
    direction="horizontal"
    :buffer="1000"
    ><template #before
      ><div
        class="fixed w-full h-12"
        style="
          background: linear-gradient(to bottom, #384047, 50%, #38404700);
          z-index: 1;
        "
      ></div
    ></template>
    <template v-slot="{ item }"><time-marker :timeMarker="item" /></template
  ></custom-scroller>
</template>

<script lang="ts">
import Year from "./Year.vue";
//@ts-ignore
import Vue from "vue";
import CustomScroller from "../Timeline/CustomScroller.vue";
import { mapState, mapGetters } from "vuex";
import { DateTime } from "luxon";
import { CascadeMetadata } from "~/src/Types";
import TimeMarker from "./TimeMarker.vue";

export default Vue.extend({
  components: { CustomScroller, TimeMarker },
  computed: {
    ...mapState({
      scale: (state: any) => state.settings.scale,
    }),
    years(): DateTime[] {
      const cascadeMetadata = this.$store.getters.metadata as CascadeMetadata;
      let years: DateTime[] = [cascadeMetadata.earliestTime];
      while (years[years.length - 1] < cascadeMetadata.latestTime) {
        years.push(years[years.length - 1].plus({ years: 1 }));
      }
      return years;
    },
    ...mapGetters(["metadata", "timeMarkers"]),
    totalWidth(): number {
      const distance = this.$store.getters.distanceBetweenDates(
        this.metadata.earliestTime,
        this.metadata.latestTime
      );
      return distance;
    },
  },
});
</script>

<style>
.vue-recycle-scroller__item-view {
  @apply absolute top-0 left-0 h-full;
}
.resize-observer {
  @apply hidden;
}
</style>