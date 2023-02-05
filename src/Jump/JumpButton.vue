<script setup lang="ts">
import { ref } from "vue";
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";
import SettingsButton from "@/Settings/SettingsButton.vue";
import { useJumpStore } from "./jumpStore";
const jumpStore = useJumpStore();

const jumpToRange = () => {
  jumpStore.setShowJumpDialog(true);
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
    @click="jumpToRange"
    :hover-hint-shortcut="'j'"
    :hover-hint-title="'Jump'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 py-px"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      stroke-width="3"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="10" cy="10" r="7"></circle>
      <line x1="21" y1="21" x2="15" y2="15"></line>
    </svg>
  </SettingsButton>
</template>

<style scoped></style>
