<template>
  <div class="flex flex-col mr-2">
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

<script>
import { throttle } from "throttle-debounce";

export default {
  data() {
    return {
      width: this.calculateScaledPosition(this.$store.state.settings.yearWidth),
    };
  },
  created() {
    this.updateWidth = throttle(50, (width) => {
      this.$store.commit("setYearWidth", width);
    });
  },
  methods: {
    calculateScaledPosition(width) {
      let minSelection = 0;
      let maxSelection = 1000;
      let minWidth = Math.log(10);
      let maxWidth = Math.log(1600);
      const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
      return (Math.log(width) - minWidth) / scale + minSelection;
    },
    startYearWidthChange() {
      this.$store.commit("setStartedWidthChange", true);
    },
    endYearWidthChange() {
      this.$store.commit("setStartedWidthChange", false);
    },
  },
  watch: {
    width(val, oldVal) {
      let minSelection = 0;
      let maxSelection = 1000;
      let minWidth = Math.log(10);
      let maxWidth = Math.log(1600);
      const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
      this.updateWidth(Math.exp(minWidth + scale * (val - minSelection)));
    },
    "$store.state.settings.yearWidth": function (val, oldVal) {
      this.width = this.calculateScaledPosition(val);
    },
  },
};
</script>

<style>
</style>