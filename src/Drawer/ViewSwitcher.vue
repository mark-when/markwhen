<script setup lang="ts">
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";
import { computed } from "vue";
import Spacer from "./Spacer.vue";
import ViewSwitcherButton from "./ViewSwitcherButton.vue";
import { useMobileViewStore } from "@/Views/mobileViewStore";
import { useVisualizationStore } from "@/Views/visualizationStore";

const panelStore = usePanelStore();
const mobileViewStore = useMobileViewStore();
const visualizationStore = useVisualizationStore();

const detailVisible = computed(() => panelStore.detailPanelState.visible);
const toggleDetail = () => {
  panelStore.setVisibility(PanelDetail, !detailVisible.value);
};
</script>

<template>
  <div class="flex flex-col rounded print-hidden items-center">
    <MenuItems />
    <template v-if="mobileViewStore.isMobile">
      <Spacer />
      <ViewSwitcherButton
        title="View"
        :selected="true"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-if="visualizationStore.showingWelcomeViewPicker"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
          ></path>
          <path
            d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
          ></path>
          <path
            d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
          ></path>
          <path d="M14 7l6 0"></path>
          <path d="M17 4l0 6"></path>
        </svg>
        <div
          class="h-4 w-4"
          v-else
          v-html="visualizationStore.currentView.iconSvg"
        ></div>
      </ViewSwitcherButton>
    </template>
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
