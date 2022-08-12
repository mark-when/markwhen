<script setup lang="ts">
import { useThrottle, useThrottleFn } from "@vueuse/core";
import { watch, ref } from "vue";
import { MAX_SCALE, MIN_SCALE, useTimelineStore } from "../timelineStore";

const timelineStore = useTimelineStore();

function calculateScaledPosition(width: number): number {
  let minSelection = 0;
  let maxSelection = 1000;
  let minWidth = Math.log(MIN_SCALE);
  let maxWidth = Math.log(MAX_SCALE);
  const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
  return (Math.log(width) - minWidth) / scale + minSelection;
}

const width = ref(calculateScaledPosition(timelineStore.pageScale));

const updateWidth = useThrottleFn((w) => {
  timelineStore.setPageScale(w);
}, 50);

watch(width, (val) => {
  let minSelection = 0;
  let maxSelection = 1000;
  let minWidth = Math.log(MIN_SCALE);
  let maxWidth = Math.log(MAX_SCALE);
  const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
  width.value = Math.exp(minWidth + scale * (val - minSelection));
  updateWidth(width.value);
});

watch(
  timelineStore.pageSettings,
  (settings) => {
    width.value = calculateScaledPosition(settings.scale);
  },
  { deep: true }
);

const startYearWidthChange = () => timelineStore.setStartedYearWidthChange
</script>

<template>
  <div class="flex-col mr-2 hidden lg:flex items-center justify-center">
    <input
      type="range"
      min="0"
      max="1000"
      v-model="width"
      class="my-1 bg-transparent"
      @mousedown="startYearWidthChange"
      @mouseup="endYearWidthChange"
      @touchstart="startYearWidthChange"
      @touchEnd="endYearWidthChange"
    />
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]:hover::-webkit-slider-runnable-track {
  background: currentColor;
  transition: 150ms all;
  border-radius: 5px;
  height: 5px;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  background: currentColor;
  transition: 150ms all;
  height: 5px;
  border-radius: 5px;
}
input[type="range"]::-moz-range-track {
  background: currentColor;
  transition: 150ms all;
  height: 5px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: currentColor;
  margin-top: -5px;
  border-radius: 50%;
  box-shadow: 0px 1px 6px 0px #00000063;
}

input[type="range"]::-moz-range-thumb {
  height: 15px;
  width: 15px;
  background: currentColor;
  margin-top: -5px;
  border-radius: 50%;
  box-shadow: 0px 1px 6px 0px #00000063;
}
</style>
