import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const globalClass = ref("");

  function setGlobalClass(gc: string) {
    globalClass.value = gc;
  }

  function clearGlobalClass() {
    globalClass.value = "";
  }

  return {
    // state
    globalClass,

    // actions
    setGlobalClass,
    clearGlobalClass,
  };
});
