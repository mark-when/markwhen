<script setup lang="ts">
import type { ViewProvider } from "@/viewProvider";

const props = defineProps<{ isActive: boolean; vp: ViewProvider }>();
const emits = defineEmits<{ (event: "click"): void }>();
</script>

<template>
  <button
    :class="
      isActive
        ? 'border-indigo-500 dark:border-indigo-400'
        : 'border-transparent'
    "
    @click="emits('click')"
    class="rounded px-2 py-1 mb-1 bg-white dark:bg-slate-900 font-bold grid border-2 vpButton"
  >
    <div
      v-html="vp.iconSvg"
      class="vpIcon flex w-full h-full justify-center items-center px-1"
    ></div>
    <span class="vpName flex px-1"
      ><span>{{ vp.name }}</span></span
    >
    <span v-if="isActive" class="ml-auto vpCheckmark">
      <svg
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
    ></span>
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
