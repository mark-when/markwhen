import { useMediaQuery } from "@vueuse/core";

export const useIsTouchscreen = () => ({
  isTouchscreen: useMediaQuery("(pointer: course)"),
  canHover: useMediaQuery('(hover)')
});
