<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTimelineStore, type Viewport } from "./stores/timelineStore";
import TimeMarkersBack from "./markers/TimeMarkersBack.vue"
import Hammer from "@squadette/hammerjs";
import { zoomer, WheelGesture } from "./utilities/zoomer";
import { useGestures } from "./composables/useGestures";

const timelineStore = useTimelineStore()

const timelineElement = ref<HTMLDivElement | null>(null)
const getViewport = (): Viewport => {
  if (!timelineElement.value) {
    return { left: 0, width: 0, top: 0 }
  }
  return {
    left: timelineElement.value.scrollLeft - timelineElement.value.offsetLeft,
    width: timelineElement.value.clientWidth + timelineElement.value.offsetLeft,
    top: timelineElement.value.scrollTop
  }
}


let mc: Hammer.Manager
const setupHammer = () => {
  timelineElement.value?.addEventListener('touchstart', touchStart)
  timelineElement.value?.addEventListener('touchend', touchEnd)
  mc = new Hammer.Manager(timelineElement.value)
  mc.add(new Hammer.Pinch({ touchAction: 'none' }))
  mc.on("pinch", pinch);
  mc.on("pinchend", pinchEnd);
}
const setViewportDateInterval = () => timelineStore.setViewport(getViewport())
const touchScreenListener = () => {
  const touchListener = (e: TouchEvent) => {
    if (!mc) {
      setupHammer()
      timelineElement.value?.removeEventListener('touchstart', touchListener)
    }
  }
  timelineElement.value?.addEventListener('touchstart', touchListener)
}



onMounted(() => {
  touchScreenListener()
  useGestures(timelineElement.value!, () => setViewportDateInterval())
  setViewportDateInterval()
})

</script>

<template>
  <div id="timeline" class="relative h-full overflow-auto w-full order-1" ref="timelineElement">
    <TimeMarkersBack />
    <!-- <events :newEventPosition="newEventPosition" :creating="!!startEventCreationRange"
      @startMakingEvent="startMakingEvent" />
    <TimeMarkersFront :markers="markers" />
    <debug v-if="$config.dev" />
    <drawer-header />
    <resize-observer @notify="handleResize" /> -->
  </div>
</template>

<style scoped>
</style>