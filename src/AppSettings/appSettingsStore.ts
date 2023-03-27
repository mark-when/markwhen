import { useVisualizationStore } from "@/Views/visualizationStore";
import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";

export const defaultViewOptions = ["Timeline", "Calendar", "Map"] as const;
export const themeOptions = ["System", "Light", "Dark"] as const;

const getSettings = () => {
  const savedSettings = localStorage.getItem("settings");
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
};

export const useAppSettingsStore = defineStore("appSettings", () => {
  const defaultView = ref<typeof defaultViewOptions[number]>("Timeline");
  const theme = ref<typeof themeOptions[number]>("System");

  const savedSettings = getSettings();
  if (savedSettings) {
    // if (
    //   savedSettings.defaultView &&
    //   defaultViewOptions.includes(savedSettings.defaultView)
    // ) {
    //   defaultView.value = savedSettings.defaultView;
    //   const foundView = visualizationStore.activeViews.findIndex(
    //     (v) => v.name === savedSettings.defaultView
    //   );
    //   if (foundView >= 0) {
    //     visualizationStore.selectedViewIndex = foundView;
    //   }
    // }
    if (savedSettings.theme && themeOptions.includes(savedSettings.theme)) {
      theme.value = savedSettings.theme;
    }
  }
  const mediaQueryDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const toggleDarkMode = () => {
    if (theme.value === "System") {
      theme.value = "Dark";
    } else if (theme.value === "Dark") {
      theme.value = "Light";
    } else {
      theme.value = "System";
    }
  };

  const inferredDarkMode = computed(() => {
    if (theme.value !== "System") {
      return theme.value === "Dark";
    }
    if (typeof window === "undefined" || !window) {
      return false;
    }
    return mediaQueryDarkMode.value;
  });

  watchEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        defaultView: defaultView.value,
        theme: theme.value,
      })
    );
  });

  return {
    defaultView,
    theme,
    inferredDarkMode,
    toggleDarkMode,
  };
});
