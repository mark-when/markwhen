import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";
import { useViewProviders } from "./composables/useViewProviders";

type DarkMode = "dark" | "light" | "system";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    selectedViewIndex: 0,
    darkMode: "system" as DarkMode,
    editable: false
  }),
  getters: {
    views(): ViewProvider[] {
      const viewProviders = useViewProviders();
      return viewProviders;
    },
    currentView(): ViewProvider {
      return this.views[this.selectedViewIndex];
    },
    inferredDarkMode(state) {
      if (state.darkMode !== "system") {
        return state.darkMode;
      }
      if (typeof window === "undefined" || !window) {
        return "light";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
  },
});
