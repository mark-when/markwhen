<script setup lang="ts">
import { useAppStore } from "@/App/appStore";
import ViewSwitcherButton from "./ViewSwitcherButton.vue";

const { views, selectedViewIndex } = useAppStore();
</script>

<template>
  <div
    class="flex flex-row rounded bg-white dark:bg-slate-700 print-hidden"
  >
    <ViewSwitcherButton
      v-for="(view, i) in views"
      :key="view.name"
      :selected="selectedViewIndex === i"
      v-html="view.iconSvg" 
      ></ViewSwitcherButton>
  </div>
</template>

<style scoped></style>
