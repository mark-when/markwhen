<script setup lang="ts">
import { useAppStore } from "@/App/appStore";
import { useAppSettingsStore } from "@/AppSettings/appSettingsStore";
import HoverHint from "@/Drawer/HoverHint.vue";
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";
import { ref } from "vue";

const appSettingsStore = useAppSettingsStore();
const toggleDarkMode = appSettingsStore.toggleDarkMode;

const hovering = ref(false);
const { canHover } = useIsTouchscreen();

const events = canHover.value
  ? {
      mouseover: () => {
        hovering.value = true;
      },
      mouseleave: () => {
        hovering.value = false;
      },
    }
  : {};
</script>

<template>
  <button
    v-on="events"
    role="button"
    title="Toggle dark mode"
    class="transition p-1 lg:hover:bg-slate-200 lg:dark:hover:bg-slate-700 rounded relative"
    @click="toggleDarkMode"
  >
    <svg
      v-if="appSettingsStore.theme === 'Light'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clip-rule="evenodd"
      />
    </svg>
    <svg
      v-if="appSettingsStore.theme === 'Dark'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      />
    </svg>
    <svg
      v-if="appSettingsStore.theme === 'System'"
      class="h-5 w-5"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9h-1.9z"
      ></path>
    </svg>
    <HoverHint :hovering="hovering" title="Toggle light/dark" shortcut="L" />
  </button>
</template>

<style scoped></style>
