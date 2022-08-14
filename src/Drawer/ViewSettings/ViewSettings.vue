<script setup lang="ts">
import { useViewStore } from "@/Views/viewStore";

const viewStore = useViewStore();
</script>

<template>
  <component
    v-for="component in viewStore.currentView.settings"
    :is="component()"
  ></component>
</template>

<style scoped></style>
