<template>
  <!-- <div class="h-full w-full"> -->
  <div class="timeMarkerContainer border border-red-500 h-full">
    <!-- <div class="fixed w-full h-12 markerShader"></div> -->
    <div class="flex flex-row h-full" :style="`margin-left: -${leftMargin}px`">
      <time-marker
        v-for="timeMarker in timeMarkers"
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
import TimeMarker from "./TimeMarker.vue";
import { viewportLeftMarginPixels } from "~/store/index";

console.log(viewportLeftMarginPixels);

export default Vue.extend({
  components: { TimeMarker },
  data() {
    return {
      leftMargin: viewportLeftMarginPixels,
    };
  },
  computed: {
    ...mapGetters(["timeMarkers"]),
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