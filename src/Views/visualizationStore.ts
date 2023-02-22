import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useViewProviders } from "./useViewProviders";
import { useViewOrchestrator } from "./ViewOrchestrator/useViewOrchestrator";

export const useVisualizationStore = defineStore("visualization", () => {
  const activeFrame = ref<HTMLIFrameElement>();
  const showingWelcomeViewPicker = ref(true);
  const selectedViewIndex = ref(-1);

  const getViewOptions = () => {
    const defaultOptions = useViewProviders();
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("viewOptions");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed as ViewProvider[];
        } catch {
          return defaultOptions;
        }
      } else {
        return defaultOptions;
      }
    }
    return defaultOptions;
  };

  const viewOptions = ref(getViewOptions());
  const activeViews = computed(() =>
    viewOptions.value.filter((vo) => vo.active)
  );

  const currentView = computed<ViewProvider>(
    () => activeViews.value[selectedViewIndex.value]
  );
  const setActiveFrame = (frame?: HTMLIFrameElement) => {
    activeFrame.value = frame;
  };

  watch(
    viewOptions,
    (vo) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "viewOptions",
          JSON.stringify(vo.filter((v) => typeof v.url === "string"))
        );
      }
    },
    { deep: true }
  );

  watchEffect(() => {
    if (selectedViewIndex.value >= activeViews.value.length) {
      selectedViewIndex.value = 0;
    } else if (selectedViewIndex.value < 0) {
      // Set default view
      selectedViewIndex.value = 2;
    }
  });

  const showWelcomeViewPicker = () => {
    showingWelcomeViewPicker.value = true;
  };

  const { jumpToRange, jumpToPath, getTimelineSvg } =
    useViewOrchestrator(activeFrame);

  return {
    selectedViewIndex,
    viewOptions,
    activeViews,
    activeFrame,
    currentView,
    showingWelcomeViewPicker,

    showWelcomeViewPicker,
    setActiveFrame,
    jumpToRange,
    jumpToPath,
    getTimelineSvg,
  };
});
