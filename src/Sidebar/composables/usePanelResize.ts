import { useAppStore } from "@/App/appStore";
import type { MaybeRef } from "@vueuse/shared";
import { ref, unref } from "vue";

export const usePanelResize = (
  isLeft: MaybeRef<boolean>,
  currentWidth: MaybeRef<number>,
  setNewWidth: (width: number) => void
) => {
  const resizeXStarted = ref(false);
  const resizeStartX = ref(0);
  const tempWidth = ref(0);
  const appStore = useAppStore();

  const pageX = (e: MouseEvent | TouchEvent) =>
    e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;

  const stop = () => {
    document.removeEventListener("mouseup", resizeMouseUp);
    document.removeEventListener("touchend", resizeMouseUp);
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("touchmove", resizeMouseMove);
    document.removeEventListener("keydown", escapeListener);
    appStore.clearGlobalClass();
  };

  const escapeListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      resizeXStarted.value = false;
      tempWidth.value = 0;
      stop();
    }
  };

  const resizeMouseMove = (e: MouseEvent | TouchEvent) => {
    if (resizeXStarted.value) {
      if (unref(isLeft)) {
        tempWidth.value = Math.max(
          unref(currentWidth) - resizeStartX.value + pageX(e),
          150
        );
      } else {
        tempWidth.value = Math.max(
          unref(currentWidth) + resizeStartX.value - pageX(e),
          150
        );
      }
    }
  };

  const resizeMouseUp = (e: MouseEvent | TouchEvent) => {
    resizeXStarted.value = false;

    if (tempWidth.value) {
      setNewWidth(Math.max(tempWidth.value, 50));
      // TODO: cookie
      tempWidth.value = 0;
    }
    stop();
  };

  const resizeMouseDown = (e: MouseEvent | TouchEvent) => {
    resizeXStarted.value = true;
    resizeStartX.value = pageX(e);

    document.addEventListener("mousemove", resizeMouseMove);
    document.addEventListener("mouseup", resizeMouseUp);
    document.addEventListener("touchmove", resizeMouseMove);
    document.addEventListener("touchend", resizeMouseUp);
    document.addEventListener("keydown", escapeListener);

    appStore.setGlobalClass("resizing");
  };

  return {
    tempWidth,
    resizeMouseDown,
  };
};
