import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useViewProviders } from "./useViewProviders";
import { useViewOrchestrator } from "./ViewOrchestrator/useViewOrchestrator";

const viewAssociationsKey = "viewAssociations";

export const useVisualizationStore = defineStore("visualization", () => {
  const showingWelcomeViewPicker = ref(true);
  const activeFrame = ref<HTMLIFrameElement>();
  const selectedViewIndex = ref(-1);

  const getViewOptions = () => {
    const defaultOptions = useViewProviders();
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

  // watch(
  //   viewOptions,
  //   (vo) => {
  //     if (typeof localStorage !== "undefined") {
  //       for (const vp of useViewProviders()) {

  //       }
  //       localStorage.setItem(
  //         "viewOptions",
  //         JSON.stringify(vo.filter((v) => typeof v.url === "string"))
  //       );
  //     }
  //   },
  //   { deep: true }
  // );

  const getExistingViewAssociations = () => {
    if (!localStorage || typeof localStorage === "undefined") {
      return;
    }
    return JSON.parse(
      localStorage.getItem(viewAssociationsKey) || "{}"
    ) as Record<string, string>;
  };

  watchEffect(() => {
    if (selectedViewIndex.value >= activeViews.value.length) {
      selectedViewIndex.value = 0;
    } else if (selectedViewIndex.value < 0) {
      // Set default view
      // Don't set view association here because we're just setting the default
      selectedViewIndex.value = 0;
    }
  });

  const showWelcomeViewPicker = () => {
    showingWelcomeViewPicker.value = true;
  };

  const { jumpToRange, jumpToPath } = useViewOrchestrator(activeFrame);

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
  };
});
