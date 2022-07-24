<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useTimelineStore, type Viewport } from "./timelineStore";
import { useMarkersStore } from "./markers/markersStore";
import TimeMarkersBack from "@/timeline/markers/TimeMarkersBack.vue"
import TimeMarkersFront from "@/timeline/markers/TimeMarkersFront.vue";
import Events from "@/timeline/events/Events.vue"
import Hammer from "@squadette/hammerjs";
import { useGestures } from "@/timeline/composables/useGestures";
import { useHoveringMarker } from "@/timeline/composables/useHoveringMarker"
import { useMouse } from "@vueuse/core"
import { usePanning } from "./composables/usePanning";

const timelineStore = useTimelineStore()
const markersStore = useMarkersStore()

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
const { trigger } = useHoveringMarker()
const scroll = () => {
  setViewportDateInterval()
  trigger()
}

const { isPanning } = usePanning(timelineElement)
useGestures(timelineElement, () => setViewportDateInterval())

onMounted(() => {
  touchScreenListener()
  setViewportDateInterval()
})
</script>

<template>
  <div id="timeline" class="relative h-full overflow-auto w-full order-1" ref="timelineElement" @scroll="scroll"
    :style="{ cursor: isPanning ? 'grabbing' : 'grab' }">
    <TimeMarkersBack />
    <events />
    <TimeMarkersFront />
    <!-- <debug v-if="$config.dev" />
    <drawer-header />
    <resize-observer @notify="handleResize" />  -->
  </div>
</template>

<style scoped>
</style>