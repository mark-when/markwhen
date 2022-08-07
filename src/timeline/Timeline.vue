<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from "vue";
import { useTimelineStore, type Viewport } from "./timelineStore";
import TimeMarkersBack from "@/Timeline/Markers/TimeMarkersBack.vue";
import TimeMarkersFront from "@/Timeline/Markers/TimeMarkersFront.vue";
import Events from "@/Timeline/Events/Events.vue";
// import Hammer from "@squadette/hammerjs";
import { useGestures } from "@/Timeline/composables/useGestures";
import { useHoveringMarker } from "@/Timeline/composables/useHoveringMarker";
import { usePanning } from "./composables/usePanning";

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

watch(
  computed(() => timelineStore.pageSettings),
  (val, oldVal) => {
    console.log("settings changed, setting viewport", val.viewport);
    nextTick(() => setViewport(val.viewport));
  }
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
