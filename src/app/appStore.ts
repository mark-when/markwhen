import { defineStore } from "pinia";

type DarkMode = "dark" | "light" | "system";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    darkMode: "system" as DarkMode,
    globalClass: ''
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
  actions: {
    setGlobalClass(gc: string) {
      this.globalClass = gc
    },
    clearGlobalClass() {
      this.globalClass = ''
    }
  }
});
