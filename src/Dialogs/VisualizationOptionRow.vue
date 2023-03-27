<script setup lang="ts">
import type { ViewProvider } from "@/viewProvider";
import { useVisualizationStore } from "@/Views/visualizationStore";
import { ref } from "vue";

const visualizationStore = useVisualizationStore();

const props = defineProps<{ isActive: boolean; vp: ViewProvider }>();
const emits = defineEmits<{ (event: "click" | "remove"): void }>();

const hovering = ref(false);
</script>

<template>
  <button
    :class="
      isActive
        ? 'border-indigo-500 dark:border-indigo-400 '
        : 'border-transparent dark:hover:border-gray-600 hover:border-gray-300'
    "
    @click="emits('click')"
    class="rounded px-1 py-1 mb-1 bg-white dark:bg-slate-900 font-bold grid border-2 vpButton"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      v-html="vp.iconSvg"
      class="vpIcon flex w-full h-full justify-center items-center px-1"
    ></div>
    <span class="vpName flex px-1"
      ><span>{{ vp.name }}</span></span
    >
    <span class="ml-auto vpCheckmark">
      <svg
        v-if="
          isActive && (!hovering || visualizationStore.activeViews.length <= 1)
        "
        class="w-5 h-5 text-indigo-500 dark:text-indigo-400"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke-width="1"
        stroke="currentColor"
      >
        <path
          d="M9 16.17 5.53 12.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L9 16.17z"
        ></path></svg
      ><svg
        v-else-if="hovering"
        data-v-30913dd0=""
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 dark:text-gray-400 dark:hover:text-red-400 text-gray-500 hover:text-red-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        @click="emits('remove')"
      >
        <path
          data-v-30913dd0=""
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </span>
    <div class="vpUrl flex px-1 text-sm text-gray-500">
      <span>{{ vp.url }}</span>
    </div>
  </button>
</template>

<style scoped>
.vpButton {
  grid-template-areas:
    "icon title checkmark"
    ". url .";
  grid-template-columns: auto 1fr auto;
}

.vpIcon {
  grid-area: icon;
}

.vpName {
  grid-area: title;
}

.vpCheckmark {
  grid-area: checkmark;
}

.vpUrl {
  grid-area: url;
}
</style>
