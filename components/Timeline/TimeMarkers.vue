<template>
  <custom-scroller
    ref="recyclerScroller"
    class="flex absolute inset-0"
    :items="timeMarkers"
    key-field="ts"
    direction="horizontal"
    :buffer="100"
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
//@ts-ignore
import Vue from "vue";
import CustomScroller from "./CustomScroller.vue";
import { mapGetters } from "vuex";
import TimeMarker from "./TimeMarker.vue";

export default Vue.extend({
  components: { CustomScroller, TimeMarker },
  computed: {
    ...mapGetters(["timeMarkers"]),
  },
});
</script>

<style>
</style>