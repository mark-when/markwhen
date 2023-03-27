<script setup lang="ts">
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";
import { computed } from "vue";
import Spacer from "./Spacer.vue";
import ViewSwitcherButton from "./ViewSwitcherButton.vue";

const panelStore = usePanelStore();

const detailVisible = computed(() => panelStore.detailPanelState.visible);
const toggleDetail = () => {
  panelStore.setVisibility(PanelDetail, !detailVisible.value);
};
</script>

<template>
  <div class="flex flex-col rounded print-hidden items-center">
    <MenuItems />
  </div>
  <div class="hidden lg:flex flex-col items-center">
    <Spacer />
    <ViewSwitcherButton
      title="Event detail"
      @click="toggleDetail"
      :selected="detailVisible"
      shortcut="d"
    >
      <svg
        class="h-5 w-5"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
        ></path>
      </svg>
    </ViewSwitcherButton>
    <Spacer />
  </div>
</template>

<style scoped></style>
