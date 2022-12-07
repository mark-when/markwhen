import { useAppStore } from "@/App/appStore";
import { useThrottleFn, type MaybeRef } from "@vueuse/shared";
import { ref, unref } from "vue";

export const usePanelMove = (
  panel: MaybeRef<HTMLElement | undefined>,
  done: (translateX: number) => void
) => {
  const startX = ref<number>();
  const translateX = ref(0);
  const parentScrollWidth = ref(0);
  const appStore = useAppStore();

  const escapeListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      stopMoving();
    }
  };

  const stopMoving = () => {
    startX.value = undefined;
    translateX.value = 0;
    document.removeEventListener("mousemove", moveListener);
    document.removeEventListener("touchmove", moveListener);
    document.removeEventListener("mouseup", endMoveListener);
    document.removeEventListener("touchend", endMoveListener);
    document.removeEventListener("keydown", escapeListener);
    appStore.clearGlobalClass();
  };

  const endMoveListener = (e: MouseEvent | TouchEvent) => {
    done(translateX.value);
    stopMoving();
  };

  const moveListener = useThrottleFn((e: MouseEvent | TouchEvent) => {
    const element = unref(panel);
    if (!element) {
      return;
    }
    // We shouldn't go any further than the start of the parent element
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX.value!;
    const parentOffsetLeft = element.parentElement?.offsetLeft || 0;
    const maxRight =
      parentScrollWidth.value -
      element.offsetLeft -
      element.clientWidth +
      parentOffsetLeft;
    translateX.value = Math.min(
      Math.max(-element.offsetLeft + parentOffsetLeft, diff),
      maxRight
    );
  }, 10);

  const startMoving = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    startX.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    document.addEventListener("touchmove", moveListener);
    document.addEventListener("mousemove", moveListener);
    document.addEventListener("touchend", endMoveListener);
    document.addEventListener("mouseup", endMoveListener);
    document.addEventListener("keydown", escapeListener);

    parentScrollWidth.value = unref(panel)!.parentElement!.scrollWidth;
    appStore.setGlobalClass("resizing");
  };

  return { moveListener: startMoving, translateX };
};
