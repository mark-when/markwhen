<template>
  <!-- <div class="h-full w-full"> -->
  <div class="timeMarkerContainer border border-red-500 h-full">
    <!-- <time-markers :style="`margin-left: -${leftMargin}px`" /> -->
    <!-- <div class="fixed w-full h-12 markerShader"></div> -->
    <div
      class="flex flex-row h-full relative"
      :style="`margin-left: -${leftMargin}px`"
    >
      <div
        v-for="timeMarker in markers"
        :key="timeMarker.ts"
        :style="`position: absolute; left: ${timeMarker.left}px; bottom: 0px; top: 0px;`"
      >
        <time-marker-vue :timeMarker="timeMarker" />
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import TimeMarkerVue from "./TimeMarker.vue";
import { TimeMarker, viewportLeftMarginPixels } from "~/store/index";
import TimeMarkers from "./TimeMarkers.vue";

export default Vue.extend({
  components: { TimeMarkerVue, TimeMarkers },
  data() {
    return {
      leftMargin: viewportLeftMarginPixels,
      markers: [] as TimeMarker[],
    };
  },
  computed: {
    ...mapGetters(["timeMarkers"]),
  },
  watch: {
    timeMarkers(newMarkers: TimeMarker[], oldMarkers: TimeMarker[]) {
      if (this.markers.length === 0) {
        this.markers = newMarkers
        return
      }

      let oldMarkersIndex = 0
      for (const newMarker of newMarkers) {
        
        let nextOld = this.markers[oldMarkersIndex]

        // This new marker is later than the next earliest that we already have.
        // Remove everything before it.
        let removed = false
        while (!!nextOld && newMarker.dateTime > nextOld.dateTime) {
          removed = true
          this.markers.splice(oldMarkersIndex, 1)
          nextOld = this.markers[oldMarkersIndex]
        }

        if (removed) {
          this.markers.splice(oldMarkersIndex, 0, newMarker)
          oldMarkersIndex++
          continue
        }

        if (!nextOld) {
          this.markers.push(newMarker)
          continue
        }

        if (newMarker.dateTime < nextOld.dateTime) {
          // This is earlier than the earliest that we already have.
          // We can insert it and incrememnt our oldMarkerIndex by one 
          // since we will have shifted all other elements to the right.
          this.markers.splice(oldMarkersIndex, 0, newMarker)
          oldMarkersIndex++
        } else if (+newMarker.dateTime === +nextOld.dateTime) {
          // This is the same marker. Just update it's visual stuff.
          nextOld.size = newMarker.size
          nextOld.left = newMarker.left
          oldMarkersIndex++
        }
      }

      // Remove all the others
      if (oldMarkersIndex < this.markers.length - 1) {
        this.markers.splice(oldMarkersIndex)
      }
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
.markerShader {
  background: linear-gradient(to bottom, #384047, 50%, #38404700);
  z-index: 1;
}
</style>