<script setup lang="ts">
import { useCollapseStore } from "../collapseStore";
import SettingsButton from "../../../Settings/SettingsButton.vue";

const { expandAll } = useCollapseStore();
</script>

<template>
  <SettingsButton @click="expandAll" hover-hint-title="Expand all"
    ><svg
      class="h-5 w-5"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
    >
      <path
        d="m12 5.83 2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7a.9959.9959 0 0 0-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34-2.46-2.46a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L12 18.17z"
      ></path></svg
  ></SettingsButton>
</template>

<style scoped></style>
