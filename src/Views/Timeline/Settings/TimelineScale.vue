<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
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

const updateWidth = (w: number) => timelineStore.setPageScale(w);

watch(
  () => timelineStore.pageSettings.scale,
  (scale) => (width.value = calculateScaledPosition(scale))
);

const changed = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value);
  let minSelection = 0;
  let maxSelection = 1000;
  let minWidth = Math.log(MIN_SCALE);
  let maxWidth = Math.log(MAX_SCALE);
  const scale = (maxWidth - minWidth) / (maxSelection - minSelection);
  const newScale = Math.exp(minWidth + scale * (value - minSelection));
  updateWidth(newScale);
};

const startYearWidthChange = () => timelineStore.setStartedWidthChange(true);
const endYearWidthChange = () => timelineStore.setStartedWidthChange(false);

let inTimer: number, outTimer: number;
const zoomingIn = ref(false);
const zoomingOut = ref(false);

watch(zoomingIn, (zooming) => {
  if (zooming) {
    timelineStore.setStartedWidthChange(true);
    const zoomIn = () => {
      nextTick(() => {
        timelineStore.setPageScale(timelineStore.pageScale * 1.05);
      });
      inTimer = setTimeout(zoomIn, 10) as unknown as number;
    };
    zoomIn();
  } else {
    clearTimeout(inTimer);
    timelineStore.setStartedWidthChange(false);
  }
});

watch(zoomingOut, (out) => {
  if (out) {
    timelineStore.setStartedWidthChange(true);
    const zoomOut = () => {
      nextTick(() => {
        timelineStore.setPageScale(timelineStore.pageScale * 0.95);
      });
      outTimer = setTimeout(zoomOut, 10) as unknown as number;
    };
    zoomOut();
  } else {
    clearTimeout(outTimer);
    timelineStore.setStartedWidthChange(false);
  }
});
const mouseDownOut = (e: MouseEvent | TouchEvent) => {
  zoomingOut.value = true;
  zoomingIn.value = false;
};

const mouseUpOut = (e: MouseEvent | TouchEvent) => {
  zoomingOut.value = false;
  zoomingIn.value = false;
};

const mouseDownIn = (e: MouseEvent | TouchEvent) => {
  zoomingIn.value = true;
  zoomingOut.value = false;
};

const mouseUpIn = (e: MouseEvent | TouchEvent) => {
  zoomingOut.value = false;
  zoomingIn.value = false;
};
</script>

<template>
  <div class="rounded mx-1 flex items-center justify-center gap-1">
    <div
      class=""
      role="button"
      @mousedown="mouseDownOut"
      @touchstart="mouseDownOut"
      @mouseup="mouseUpOut"
      @touchend="mouseUpOut"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4"
        stroke-width="2"
        stroke="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div
      class=""
      role="button"
      @mousedown="mouseDownIn"
      @touchstart="mouseDownIn"
      @mouseup="mouseUpIn"
      @touchend="mouseUpIn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4"
        stroke-width="2"
        stroke="currentColor"
      >
        <path
          d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
        />
      </svg>
    </div>
  </div>
  <div class="flex-col mr-2 hidden lg:flex items-center justify-center">
    <input
      type="range"
      min="0"
      max="1000"
      :value="width"
      @input="changed"
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
