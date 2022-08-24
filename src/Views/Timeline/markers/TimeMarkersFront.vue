<script setup lang="ts">
import { viewportLeftMarginPixels } from '../utilities/dateTimeUtilities';
import { useMarkersStore } from './markersStore';
import TimeMarkerFront from "@/Views/Timeline/Markers/TimeMarkerFront.vue"
import { useAppStore } from '@/App/appStore';
import { computed } from 'vue';

const appStore = useAppStore()

const dark = computed(() => appStore.inferredDarkMode)

const markerStore = useMarkersStore()

const leftMargin = viewportLeftMarginPixels
</script>

<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="timeMarkerContainer h-full">
      <div class="flex h-full" :style="`margin-left: -${leftMargin}px`">
        <div class="timeMarkerShader w-full h-12 fixed top-0" :style="{
          marginLeft: `${leftMargin}px`, background: `linear-gradient(${dark ? 'to bottom, #374151, 65%, #38404700'
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