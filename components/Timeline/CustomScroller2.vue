<template>
  <!-- <div class="h-full w-full"> -->
  <div class="timeMarkerContainer h-full pointer-events-none">
    <div class="fixed w-full h-12 markerShader top-0"></div>
    <div class="flex flex-row h-full" :style="`margin-left: -${leftMargin}px`">
      <time-marker-vue
        v-for="timeMarker in markers"
        :key="timeMarker.ts"
        :timeMarker="timeMarker"
      />
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
  methods: {
    setNewMarkers(newMarkers: TimeMarker[]) {
      if (!newMarkers) {
        this.markers = [];
      }

      if (this.markers.length === 0) {
        this.markers = newMarkers;
        return;
      }

      let oldMarkersIndex = 0;

      for (const newMarker of newMarkers) {
        let nextOld = this.markers[oldMarkersIndex];

        // This new marker is later than the next earliest that we already have.
        // Remove everything before it.
        let removed = false;
        while (!!nextOld && newMarker.dateTime > nextOld.dateTime) {
          removed = true;
          this.markers.splice(oldMarkersIndex, 1);
          nextOld = this.markers[oldMarkersIndex];
        }

        if (!nextOld) {
          this.markers.push(newMarker);
          continue;
        }

        if (newMarker.dateTime < nextOld.dateTime) {
          // This is earlier than the earliest that we already have.
          // We can insert it and incrememnt our oldMarkerIndex by one
          // since we will have shifted all other elements to the right.
          this.markers.splice(oldMarkersIndex, 0, newMarker);
          oldMarkersIndex++;
        } else if (+newMarker.dateTime === +nextOld.dateTime) {
          // This is the same marker. Just update it's visual stuff.
          nextOld.size = newMarker.size;
          nextOld.left = newMarker.left;
          oldMarkersIndex++;
        } else if (removed) {
          this.markers.splice(oldMarkersIndex, 0, newMarker);
          oldMarkersIndex++;
        }
      }

      // Remove all the others
      if (oldMarkersIndex < this.markers.length - 1) {
        this.markers.splice(oldMarkersIndex);
      }
    },
  },
  watch: {
    timeMarkers(newMarkers: TimeMarker[], oldMarkers: TimeMarker[]) {
      this.setNewMarkers(newMarkers);
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
  background: linear-gradient(to bottom, #384047, 65%, #38404700);
  z-index: 2;
}
</style>