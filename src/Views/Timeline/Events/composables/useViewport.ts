import type { MaybeRef } from "@vueuse/core";
import { unref } from "vue";

export const useViewport = (el: MaybeRef<HTMLDivElement | null>) => {
  const timelineElement = unref(el);
  if (!timelineElement) {
    return { left: 0, width: 0, top: 0 };
  }
  return {
    left: timelineElement.scrollLeft - timelineElement.offsetLeft,
    width: timelineElement.clientWidth + timelineElement.offsetLeft,
    top: timelineElement.scrollTop,
  };
};
