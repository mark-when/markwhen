import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

type DarkMode = "dark" | "light" | "system";

export const useAppStore = defineStore("app", () => {
  const darkMode = ref("system" as DarkMode);
  const globalClass = ref("");

  const mediaQueryDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const inferredDarkMode = computed(() => {
    if (darkMode.value !== "system") {
      return darkMode.value === 'dark';
    }
    if (typeof window === "undefined" || !window) {
      return false;
    }
    return mediaQueryDarkMode.value;
  });

  function setGlobalClass(gc: string) {
    globalClass.value = gc;
  }

  function clearGlobalClass() {
    globalClass.value = "";
  }

  const toggleDarkMode = () => {
    if (darkMode.value === 'system') {
      darkMode.value = 'dark'
    } else if (darkMode.value === 'dark') {
      darkMode.value = 'light'
    } else {
      darkMode.value = 'system'
    }
  }

  return {
    // state
    darkMode,
    globalClass,

    // actions
    setGlobalClass,
    clearGlobalClass,
    toggleDarkMode,

    // getters
    inferredDarkMode,
  };
});
