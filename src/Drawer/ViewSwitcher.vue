<script setup lang="ts">
import { useViewStore } from "@/Views/viewStore";
import ViewSwitcherButton from "./ViewSwitcherButton.vue";

const { views, selectedViewIndex } = useViewStore();
</script>

<template>
  <div
    class="flex flex-col rounded bg-white dark:bg-slate-700 print-hidden"
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
