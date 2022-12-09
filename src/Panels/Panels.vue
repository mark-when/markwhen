<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useViewStore } from "@/Views/viewStore";
import EventDetailPanel from "@/EventDetail/EventDetailPanel.vue";
import { usePanelStore } from "./panelStore";
import { useViewOrchestrator } from "@/Views/ViewOrchestrator/useViewOrchestrator";
import Timeline from "@/Views/Timeline/Timeline.vue";
import { useVsCode } from "@/VSCode/composables/useVsCode";

const viewStore = useViewStore();
const panelStore = usePanelStore();
const currentView = computed(() => viewStore.currentView);
const detailVisible = computed(() => panelStore.detailPanelState.visible);
const currentViewComponent = computed(() => {
  if (
    viewStore.currentView.name === "Timeline" ||
    viewStore.currentView.name === "Gantt"
  ) {
    return Timeline;
  }
  return viewStore.currentView.component();
});
const vscode = useVsCode();
const frames = ref<HTMLIFrameElement[]>();

const activeFrame = computed(() =>
  frames.value?.find((f) => f.id === `view_${currentView.value.name}`)
);

useViewOrchestrator(activeFrame);

const translateX = computed(
  () => panelStore.visualizationPanelState.translation
);

const visualizationStyle = computed(() => {
  if (translateX.value !== 0) {
    return {
      transform: `translateX(${translateX.value}px)`,
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  }
  const givenTranslation = panelStore.visualizationPanelState.translation;
  if (givenTranslation) {
    return {
      transform: `translateX(${givenTranslation}px)`,
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  } else if (panelStore.isMoving) {
    return {
      transition: `transform cubic-bezier(0.4, 0, 0.2, 1) 150ms`,
    };
  }
});

const currentComponent = computed(() => currentView.value.component());
const framedComponents = computed(() =>
  viewStore.views.filter((v) => typeof v.component() === "string")
);

const isFrameEnabled = (src: string) => {
  console.log("checking", src, "against", viewStore.allowedSources);
  return viewStore.allowedSources.includes(src);
};
const host = (src: string) => {
  try {
    const url = new URL(src);
    return url.host;
  } catch {
    return src;
  }
};

const enable = (src: string) => {
  vscode.allowSource(src);
};

onMounted(() => {
  vscode.allowSource()
})
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-auto">
    <div class="w-full h-full overflow-auto" :style="visualizationStyle">
      <template v-for="component in framedComponents">
        <div
          class="w-full h-full flex flex-row items-center justify-center"
          v-if="!isFrameEnabled(component.component())"
          v-show="currentComponent === component.component()"
        >
          <div class="text-sm">
            <h3>
              This visualization is hosted from
              <span class="font-bold">{{ host(component.component()) }}</span>
            </h3>
            <div class="flex">
              <button @click="enable(component.component())" class="underline">
                Enable
              </button>
            </div>
          </div>
        </div>
        <iframe
          v-else
          ref="frames"
          class="w-full h-full"
          v-show="currentComponent === component.component()"
          :src="component.component()"
          :id="`view_${component.name}`"
        ></iframe>
      </template>
      <!-- <iframe
        ref="frames"
        v-for="component in viewStore.framedViews"
        class="w-full h-full"
        v-show="currentViewComponent === component.component()"
        :src="component.component()"
        :id="`view_${component.name}`"
      ></iframe> -->
      <keep-alive>
        <component
          :is="currentViewComponent"
          :key="currentView.name === 'Gantt' ? 'Timeline' : currentView.name"
          v-if="typeof currentViewComponent !== 'string'"
        />
      </keep-alive>
      <div class="absolute inset-0 frameCover"></div>
    </div>
    <EventDetailPanel v-if="detailVisible && !viewStore.isMobile" />
  </div>
</template>

<style scoped>
.frameCover {
  pointer-events: none;
}
.resizing .frameCover {
  pointer-events: auto;
}
</style>
