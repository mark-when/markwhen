import { ref } from "vue";
import { useSidebarStore } from "../sidebarStore";

export const useSidebarResize = () => {
  const sidebarStore = useSidebarStore();

  const resizeXStarted = ref(false);
  const resizeStartX = ref(0);
  const tempWidth = ref(0);

  const pageX = (e: MouseEvent | TouchEvent) =>
    e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;

  const stop = () => {
    document.removeEventListener("mouseup", resizeMouseUp);
    document.removeEventListener("touchend", resizeMouseUp);
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("touchmove", resizeMouseMove);
    document.removeEventListener("keydown", escapeListener);
  };

  const escapeListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      resizeXStarted.value = false
      tempWidth.value = 0
      stop()
    }
  };

  const resizeMouseMove = (e: MouseEvent | TouchEvent) => {
    if (resizeXStarted.value) {
      if (sidebarStore.isLeft) {
        tempWidth.value = sidebarStore.width - resizeStartX.value + pageX(e);
      } else {
        tempWidth.value = sidebarStore.width + resizeStartX.value - pageX(e);
      }
    }
  };

  const resizeMouseUp = (e: MouseEvent | TouchEvent) => {
    resizeXStarted.value = false;

    if (tempWidth.value) {
      sidebarStore.setWidth(Math.max(tempWidth.value, 50));
      // TODO: cookie
      tempWidth.value = 0;
    }
    stop()
  };

  const resizeMouseDown = (e: MouseEvent | TouchEvent) => {
    resizeXStarted.value = true;
    resizeStartX.value = pageX(e);

    document.addEventListener("mousemove", resizeMouseMove);
    document.addEventListener("mouseup", resizeMouseUp);
    document.addEventListener("touchmove", resizeMouseMove);
    document.addEventListener("touchend", resizeMouseUp);
    document.addEventListener("keydown", escapeListener);
  };

  return {
    tempWidth,
    resizeMouseDown,
  };
};
