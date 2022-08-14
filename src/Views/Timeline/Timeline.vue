<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from "vue";
import { useTimelineStore, type Viewport } from "./timelineStore";
import TimeMarkersBack from "@/Views/Timeline/Markers/TimeMarkersBack.vue";
import TimeMarkersFront from "@/Views/Timeline/Markers/TimeMarkersFront.vue";
import Events from "@/Views/Timeline/Events/Events.vue";
// import Hammer from "@squadette/hammerjs";
import { useGestures } from "@/Views/Timeline/composables/useGestures";
import { useHoveringMarker } from "@/Views/Timeline/composables/useHoveringMarker";
import { usePanning } from "./composables/usePanning";
import { DateTime } from "luxon";

const timelineStore = useTimelineStore();

const timelineElement = ref<HTMLDivElement | null>(null);
const getViewport = (): Viewport => {
  if (!timelineElement.value) {
    return { left: 0, width: 0, top: 0 };
  }
  return {
    left: timelineElement.value.scrollLeft - timelineElement.value.offsetLeft,
    width: timelineElement.value.clientWidth + timelineElement.value.offsetLeft,
    top: timelineElement.value.scrollTop,
  };
};

const setViewport = (v: Viewport) => {
  if (!timelineElement.value) {
    return;
  }
  timelineElement.value.scrollLeft = v.left;
  timelineElement.value.scrollTop = v.top;
};

const widthChangeStartScrollLeft = ref<number | null>(null);
const widthChangeStartYearWidth = ref<number | null>(null);
watch(
  () => timelineStore.startedWidthChange,
  (started) => {
    widthChangeStartScrollLeft.value = started
      ? timelineElement.value?.scrollLeft ?? null
      : null;
    widthChangeStartYearWidth.value = timelineStore.pageSettings.scale;
  }
);
watch(
  () => timelineStore.pageSettings,
  (settings) => {
    nextTick(() => setViewport(settings.viewport));
    if (!timelineStore.startedWidthChange || !timelineElement.value) {
      return;
    }
    const startCenter =
      widthChangeStartScrollLeft.value! + timelineElement.value.clientWidth / 2;
    const scale = settings.scale / (widthChangeStartYearWidth.value || 1);
    timelineElement.value.scrollLeft =
      scale * startCenter - timelineElement.value.clientWidth / 2;
  },
  { deep: true }
);

// let mc: Hammer.Manager
// const setupHammer = () => {
//   timelineElement.value?.addEventListener('touchstart', touchStart)
//   timelineElement.value?.addEventListener('touchend', touchEnd)
//   mc = new Hammer.Manager(timelineElement.value)
//   mc.add(new Hammer.Pinch({ touchAction: 'none' }))
//   mc.on("pinch", pinch);
//   mc.on("pinchend", pinchEnd);
// }
const setViewportDateInterval = () => timelineStore.setViewport(getViewport());
const touchScreenListener = () => {
  const touchListener = (e: TouchEvent) => {
    // if (!mc) {
    //   setupHammer()
    //   timelineElement.value?.removeEventListener('touchstart', touchListener)
    // }
  };
  timelineElement.value?.addEventListener("touchstart", touchListener);
};
const { trigger } = useHoveringMarker();
const scroll = () => {
  setViewportDateInterval();
  trigger();
};

const { isPanning } = usePanning(timelineElement);
useGestures(timelineElement, () => setViewportDateInterval());

const scrollToDate = (dateTime: DateTime) => {
  const el = timelineElement.value;
  if (el) {
    const fromLeft = timelineStore.distanceFromBaselineLeftmostDate(dateTime);
    const { left, width } = getViewport();

    // If it isn't already within view
    if (fromLeft < left || fromLeft > left + width) {
      el.scrollLeft = fromLeft - width / 2;
    }
  }
};
const scrollToNow = () => scrollToDate(DateTime.now());
watch(
  () => timelineStore.hideNowLine,
  (hide) => !hide && scrollToNow()
);
onMounted(() => {
  touchScreenListener();
  setViewportDateInterval();
});
</script>

<template>
  <div
    id="timeline"
    class="relative h-full overflow-auto w-full order-1"
    ref="timelineElement"
    @scroll="scroll"
    :style="{ cursor: isPanning ? 'grabbing' : 'grab' }"
  >
    <TimeMarkersBack />
    <Events />
    <TimeMarkersFront />
    <!-- <debug v-if="$config.dev" />
    <drawer-header />
    <resize-observer @notify="handleResize" />  -->
  </div>
</template>

<style scoped></style>
