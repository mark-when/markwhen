import { defineStore } from "pinia";
import { ref } from "vue";

export type SidebarComponent = "" | "editor" | "profile"

export const useSidebarStore = defineStore("sidebar", () => {
  const selectedComponent = ref<SidebarComponent>("");
  const isLeft = ref(true);
  const hasSeenHowTo = ref(true);
  const width = ref(450);
  const visible = ref(true)

  const setWidth = (w: number) => {
    width.value = w;
  };

  const selectComponent = (c: SidebarComponent) => {
    selectedComponent.value = c
  }

  const toggleSide = () => {
    isLeft.value = !isLeft.value
  }

  const toggle = () => {
    visible.value = !visible.value
  }

  return {
    // state
    selectedComponent,
    isLeft,
    hasSeenHowTo,
    width,
    visible,
    
    // actions
    setWidth,
    selectComponent,
    toggleSide,
    toggle
  };
});
