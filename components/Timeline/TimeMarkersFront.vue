<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="timeMarkerContainer h-full">
      <div class="flex h-full" :style="`margin-left: -${leftMargin}px`">
        <div
          class="timeMarkerShader w-full h-12 fixed top-0"
          :style="`margin-left: ${leftMargin}px; background: linear-gradient(${
            darkMode === 'dark'
              ? 'to bottom, #384047, 65%, #38404700'
              : 'to bottom, rgb(226 232 240), 65%, #ffffff00'
          })`"
        ></div>
        <time-marker-front
          v-for="timeMarker in markers"
          :key="timeMarker.ts"
          :timeMarker="timeMarker"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeMarkerFront from "./TimeMarkerFront.vue";
import { viewportLeftMarginPixels } from "~/store/index";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { TimeMarkerFront },
  props: ["markers"],
  computed: mapGetters({ darkMode: "sidebar/darkMode" }),
  data() {
    return {
      leftMargin: viewportLeftMarginPixels,
    };
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
.timeMarkerShader {
  z-index: -1;
}
/* @media (prefers-color-scheme: dark) {
  .timeMarkerShader {
    background: linear-gradient(to bottom, #384047, 65%, #38404700);
  }
}

@media (prefers-color-scheme: light) {
  .timeMarkerShader {
    background: linear-gradient(to bottom, rgb(226 232 240), 65%, #ffffff00);
  }
} */
</style>