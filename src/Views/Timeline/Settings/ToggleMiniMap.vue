<script setup lang="ts">
import SettingsButton from "@/Settings/SettingsButton.vue";
import { useTimelineStore } from "../timelineStore";

const timelineStore = useTimelineStore();

const toggle = () => timelineStore.toggleMiniMap();
</script>

<template>
  <SettingsButton @click="toggle" hover-hint-title="Toggle mini map">
    <svg
      style="transform: rotate(180deg)"
      focusable="false"
      aria-hidden="true"
      viewBox="1 -1 20 21"
      class="w-5 h-5"
      fill="currentColor"
    >
      <path
        d="M 16 5 H 10 V 10 H 16 V 5 Z M 18 1 H 4 C 3 1 2 2 2 3 V 16 C 2 17 3 18 4 18 H 18 C 19 18 20 17 20 16 V 3 C 20 1.9 19.1 1 18 1 Z M 18 16 H 4 V 3 H 18 V 16 Z"
      ></path></svg
  ></SettingsButton>
</template>

<style scoped></style>
