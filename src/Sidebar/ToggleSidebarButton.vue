<script setup lang="ts">
import HoverHint from "@/Drawer/HoverHint.vue";
import SettingsButton from "@/Settings/SettingsButton.vue";
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";
import { ref } from "vue";
import { useSidebarStore } from "./sidebarStore";

const sidebarStore = useSidebarStore();

const toggleSidebar = () => {
  sidebarStore.toggle();
  hovering.value = false;
};

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
  <SettingsButton
    title="Toggle sidebar"
    @click="toggleSidebar"
    hover-hint-shortcut="z"
    hover-hint-title="Toggle sidebar"
  >
    <svg
      v-if="!sidebarStore.visible"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="20" y1="12" x2="10" y2="12"></line>
      <line x1="20" y1="12" x2="16" y2="16"></line>
      <line x1="20" y1="12" x2="16" y2="8"></line>
      <line x1="4" y1="4" x2="4" y2="20"></line>
    </svg>
    <svg
      v-if="sidebarStore.visible"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="10" y1="12" x2="20" y2="12"></line>
      <line x1="10" y1="12" x2="14" y2="16"></line>
      <line x1="10" y1="12" x2="14" y2="8"></line>
      <line x1="4" y1="4" x2="4" y2="20"></line>
    </svg>
  </SettingsButton>
</template>

<style scoped></style>
