import { useMediaQuery } from "@vueuse/core";
import { ref } from "vue"; 

export const useIsTouchscreen = () => ({
  isTouchscreen: useMediaQuery("(pointer: course)"),
  canHover: useMediaQuery('(hover)')
});
