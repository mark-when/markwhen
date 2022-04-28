<template>
  <div class="flex-col mr-2 hidden md:flex">
    <input
      type="range"
      min="0"
      max="1000"
      v-model="width"
      class="my-1"
      @mousedown="startYearWidthChange"
      @mouseup="endYearWidthChange"
      @touchstart="startYearWidthChange"
      @touchEnd="endYearWidthChange"
    />
  </div>
</template>

<script lang="ts">
import { throttle } from "throttle-debounce";
import Vue from "vue";
import { MAX_SCALE, MIN_SCALE } from "~/store";

function calculateScaledPosition(width: number): number {
  let minSelection = 0;
  let maxSelection = 1000;
  let minWidth = Math.log(MIN_SCALE);
  let maxWidth = Math.log(MAX_SCALE);
  const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
  return (Math.log(width) - minWidth) / scale + minSelection;
}

export default Vue.extend({
  data() {
    return {
      width: calculateScaledPosition(this.$store.getters.settings.scale),
    };
  },
  created() {
    this.updateWidth = throttle(50, (width) => {
      this.$store.commit("setScale", width);
    });
  },
  methods: {
    startYearWidthChange() {
      this.$store.commit("setStartedWidthChange", true);
    },
    endYearWidthChange() {
      this.$store.commit("setStartedWidthChange", false);
    },
    updateWidth(width: number) {},
  },
  watch: {
    width(val, oldVal) {
      let minSelection = 0;
      let maxSelection = 1000;
      let minWidth = Math.log(MIN_SCALE);
      let maxWidth = Math.log(MAX_SCALE);
      const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
      this.updateWidth(Math.exp(minWidth + scale * (val - minSelection)));
    },
    "$store.getters.settings": {
      handler: function (val, oldVal) {
        this.width = calculateScaledPosition(val.scale);
      },
      deep: true,
    },
  },
});
</script>

<style>
</style>