<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import SettingsButton from "@/Settings/SettingsButton.vue";
import { computed } from "vue";

const transformStore = useTransformStore();

const buttonTitle = computed(() => {
  if (transformStore.sort === "none") {
    return "Not sorted";
  }
  if (transformStore.sort === "down") {
    return "Sort reverse chronologically";
  }
  return "Sort chronologically";
});

const click = () => transformStore.toggleSort();
</script>

<template>
  <SettingsButton @click="click" hoverHintTitle="Sort" :title="buttonTitle"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 19 16"
      fill="currentColor"
    >
      <path
        v-if="transformStore.sort === 'none'"
        d="M 2 3 A 1 1 0 0 0 2 5 H 13 A 1 1 0 1 0 13 3 H 2 Z M 3 7 A 1 1 0 0 0 3 9 H 8 A 1 1 0 0 0 8 7 H 3 Z M 4 11 A 1 1 0 1 0 4 13 H 7 A 1 1 0 1 0 7 11 H 4 Z M 14 8 A 4 4 0 0 0 14 16 A 4 4 0 1 0 14 8 Z M 12 12 A 2 2 0 1 1 16 12 A 2 2 0 0 1 12 12 Z"
      />
      <path
        v-else-if="transformStore.sort === 'down'"
        d="M 2 3 a 1 1 0 0 0 0 2 h 11 a 1 1 0 1 0 0 -2 H 2 z M 3 7 a 1 1 0 0 0 0 2 h 7 a 1 1 0 0 0 0 -2 H 3 z M 4 11 a 1 1 0 1 0 0 2 h 3 a 1 1 0 1 0 0 -2 H 4 z M 15 8 a 1 1 0 1 0 -2 0 v 5.586 l -1.293 -1.293 a 1 1 0 0 0 -1.414 1.414 l 3 3 a 1 1 0 0 0 1.414 0 l 3 -3 a 1 1 0 0 0 -1.414 -1.414 L 15 13.586 V 8 z"
      />
      <path
        v-else
        d="M 2 3 a 1 1 0 0 0 0 2 h 11 a 1 1 0 1 0 0 -2 H 2 z M 3 7 a 1 1 0 0 0 0 2 h 4 a 1 1 0 0 0 0 -2 H 3 z M 4 11 a 1 1 0 1 0 0 2 h 3 a 1 1 0 1 0 0 -2 H 4 z M 13 16 a 1 1 0 1 0 2 0 v -5.586 l 1.293 1.293 a 1 1 0 0 0 1.414 -1.414 l -3 -3 a 1 1 0 0 0 -1.414 0 l -3 3 a 1 1 0 1 0 1.414 1.414 L 13 10.414 V 16 z"
      /></svg
  ></SettingsButton>
</template>

<style scoped></style>
