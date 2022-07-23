import { defineStore } from "pinia";

type DarkMode = "dark" | "light" | "system";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    view: "timeline",
    darkMode: "system" as DarkMode,
  }),
  getters: {
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
