<script setup lang="ts">
import SettingsButton from "@/Settings/SettingsButton.vue";
</script>

<template>
  <SettingsButton hoverHintTitle="Toggle now line">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 2 17 12" class="h-5 w-5">
      <path
        d="m 2 3 a 1 1 0 0 0 0 2 h 11 a 1 1 0 1 0 0 -2 h -11 z m 1 4 a 1 1 0 0 0 0 2 h 11 a 1 1 0 0 0 0 -2 h -11 z m 1 4 a 1 1 0 1 0 0 2 h 11 a 1 1 0 1 0 0 -2 h -11 z"
        fill="currentColor"
      />
      <path d="M 9 1 L 9 15 L 11 15 L 11 1 L 11 1 Z" fill="currentColor"></path>
    </svg>
  </SettingsButton>
</template>

<style scoped></style>
