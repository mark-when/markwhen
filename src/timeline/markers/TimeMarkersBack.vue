<script setup lang="ts">
import { viewportLeftMarginPixels } from '../utilities/dateTimeUtilities';
import { useMarkersStore } from './markersStore';
import TimeMarkerBack from './TimeMarkerBack.vue';

const markersStore = useMarkersStore()
const leftMargin = viewportLeftMarginPixels
</script>

<template>
  <div class="fixed inset-0">
    <div class="timeMarkerContainer h-full">
      <div class="flex flex-row h-full" :style="`margin-left: -${leftMargin}px`">
        <time-marker-back v-for="timeMarker in markersStore.markers" :key="timeMarker.ts" :timeMarker="timeMarker" />
      </div>
    </div>
  </div>
</template>

<style>
.timeMarkerContainer {
  position: sticky;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>