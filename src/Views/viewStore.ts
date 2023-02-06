import { useMobileViewProviders } from "@/Views/useMobileViewProviders";
import { useViewProviders } from "@/Views/useViewProviders";
import type { ViewProvider } from "@/viewProvider";
import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useViewOrchestrator } from "./ViewOrchestrator/useViewOrchestrator";

export const useViewStore = defineStore("views", () => {
  const selectedViewIndex = ref(-1);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  // const timelineStore = useTimelineStore();
  const activeFrame = ref<HTMLIFrameElement>();
  const showingViewsDialog = ref(false);

  const setActiveFrame = (frame?: HTMLIFrameElement) => {
    activeFrame.value = frame;
  };

  const framedViews = computed(() => views.value.filter((v) => v.url));
  const currentView = computed<ViewProvider>(
    () => views.value[selectedViewIndex.value]
  );

  const getViewOptions = () => {
    const defaultOptions = useViewProviders();
    if (typeof localStorage !== "undefined") {
      const options = localStorage.getItem("viewOptions");
      if (options) {
        try {
          const parsed = JSON.parse(options);
          return parsed as ViewProvider[];
        } catch {
          return defaultOptions;
        }
      }
      return defaultOptions;
    } else {
      return defaultOptions;
    }
  };

  const viewOptions = ref(getViewOptions());

  const views = ref<ViewProvider[]>(
    isMobile.value ? useMobileViewProviders() : useViewProviders()
  );

  watch(
    viewOptions,
    (v) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("viewOptions", JSON.stringify(v));
      }
    },
    { deep: true }
  );

  watch(
    views,
    (v) => {
      for (const view of v) {
        if (!viewOptions.value) {
          viewOptions.value = v;
        }
        if (
          viewOptions.value.findIndex(
            (vo) => vo.name === view.name && vo.url === view.url
          ) < 0
        ) {
          viewOptions.value.push(view);
        }
      }
    },
    { deep: true }
  );

  watchEffect(() => {
    if (selectedViewIndex.value >= views.value.length) {
      selectedViewIndex.value = 0;
    } else if (selectedViewIndex.value < 0) {
      // Set default view
      selectedViewIndex.value = 2;
    }
  });

  const setSelectedViewIndex = (i: number) => {
    selectedViewIndex.value = i;
  };

  const { jumpToRange, jumpToPath } = useViewOrchestrator(activeFrame);

  return {
    // state
    selectedViewIndex,
    views,
    isMobile,
    showingViewsDialog,
    viewOptions,

    // getters
    currentView,
    framedViews,

    // actions
    setSelectedViewIndex,
    setActiveFrame,
    jumpToPath,
    jumpToRange,
  };
});
