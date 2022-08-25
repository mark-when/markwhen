import { defineStore } from "pinia";
import { ref } from "vue";

export type SidebarComponent = "" | "editor" | "profile"

export const useSidebarStore = defineStore("sidebar", () => {
  const selectedComponent = ref<SidebarComponent>("");
  const isLeft = ref(true);
  const hasSeenHowTo = ref(true);
  const width = ref(450);
  const resizeXStarted = ref(false);
  const resizeStartX = ref(0);
  const tempWidth = ref(0);

  const setWidth = (w: number) => {
    width.value = w;
  };

  const selectComponent = (c: SidebarComponent) => {
    selectedComponent.value = c
  }

  return {
    // state
    selectedComponent,
    isLeft,
    hasSeenHowTo,
    width,
    resizeXStarted,
    resizeStartX,
    tempWidth,
    
    // actions
    setWidth,
    selectComponent
  };
});
