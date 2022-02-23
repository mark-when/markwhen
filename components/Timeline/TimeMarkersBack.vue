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
          :timeMarker="timeMarker"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeMarkerBack from "./TimeMarkerBack.vue";
import { viewportLeftMarginPixels } from "~/store/index";

export default Vue.extend({
  components: { TimeMarkerBack },
  props: ["markers"],
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
</style>