import { useStorageStore } from "@/Storage/storageStore";
import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";
import { computed, ref, watch, watchEffect } from "vue";
import { useViewProviders } from "./useViewProviders";
import { useViewOrchestrator } from "./ViewOrchestrator/useViewOrchestrator";

const viewAssociationsKey = "viewAssociations";

export const useVisualizationStore = defineStore("visualization", () => {
  const storageStore = useStorageStore();
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

  const viewAssociationKeyForStorageType = computed(() => {
    switch (storageStore.storageType) {
      case "cloud":
        return storageStore.cloudPath;
      case "draft":
        return storageStore.draftName || "draft";
    }
  });

  const setViewAssociation = () => {
    const existingViewAssociations = getExistingViewAssociations();
    if (!existingViewAssociations) {
      return;
    }

    if (viewAssociationKeyForStorageType.value && currentView.value) {
      const updatedAssociations = {
        ...existingViewAssociations,
        [viewAssociationKeyForStorageType.value]: currentView.value.id,
      };
      localStorage.setItem(
        viewAssociationsKey,
        JSON.stringify(updatedAssociations)
      );
    }
  };

  const getAndApplyViewAssociation = () => {
    const existingViewAssociations = getExistingViewAssociations();
    if (!existingViewAssociations) {
      return;
    }
    if (existingViewAssociations && viewAssociationKeyForStorageType.value) {
      const viewId =
        existingViewAssociations[viewAssociationKeyForStorageType.value];
      if (viewId) {
        const index = viewOptions.value.findIndex((vp) => vp.id === viewId);
        if (index !== -1) {
          selectedViewIndex.value = index;
          showingWelcomeViewPicker.value = false;
          return true;
        }
      }
    }
    return false;
  };

  watch(
    [
      () => storageStore.storageType,
      () => storageStore.draftName,
      () => storageStore.cloudPath,
    ],
    () => {
      getAndApplyViewAssociation();
      setViewAssociation();
    },
    { immediate: true }
  );

  watch(selectedViewIndex, (val, oldVal) => {
    if (val !== oldVal) {
      setViewAssociation();
    }
  });

  watchEffect(() => {
    if (selectedViewIndex.value >= activeViews.value.length) {
      selectedViewIndex.value = 0;
    } else if (selectedViewIndex.value < 0) {
      // Set default view
      // Don't set view association here because we're just setting the default
      selectedViewIndex.value = 2;
    }
  });

  watch(showingWelcomeViewPicker, (showing) => {
    if (!showing) {
      setViewAssociation();
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

    getAndApplyViewAssociation,
    setViewAssociation,
    showWelcomeViewPicker,
    setActiveFrame,
    jumpToRange,
    jumpToPath,
    getTimelineSvg,
  };
});
