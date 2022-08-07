<script setup lang="ts">
import { viewportLeftMarginPixels } from '../utilities/dateTimeUtilities';
import { useMarkersStore } from './markersStore';
import TimeMarkerFront from "@/Timeline/Markers/TimeMarkerFront.vue"
import { useMediaQuery } from '@vueuse/core';

const isDark = useMediaQuery('(prefers-color-scheme: dark)')

const markerStore = useMarkersStore()

const leftMargin = viewportLeftMarginPixels
</script>

<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="timeMarkerContainer h-full">
      <div class="flex h-full" :style="`margin-left: -${leftMargin}px`">
        <div class="timeMarkerShader w-full h-12 fixed top-0" :style="{
          marginLeft: `${leftMargin}px`, background: `linear-gradient(${isDark ? 'to bottom, #374151, 65%, #38404700'
            : 'to bottom, rgb(241 245 249), 65%, #ffffff00'})`
        }"></div>
        <!-- <SquashBar /> -->
        <TimeMarkerFront v-for="timeMarker in markerStore.markers" :key="timeMarker.ts" :timeMarker="timeMarker" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeMarkerShader {
  z-index: -1;
}
</style>