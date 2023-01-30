<script setup lang="ts">
import SettingsButton from "@/Settings/SettingsButton.vue";
import { useViewStore } from "@/Views/viewStore";

const viewStore = useViewStore();
</script>

<template>
  <SettingsButton
    v-for="setting in viewStore.currentView.settings"
  >
  </SettingsButton>
</template>

<style scoped></style>
