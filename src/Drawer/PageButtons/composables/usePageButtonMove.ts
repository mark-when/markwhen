import type { MaybeRef } from "@vueuse/shared";
import { ref, unref } from "vue";

export const usePageButtonMove = (
  b: MaybeRef<HTMLButtonElement | undefined>,
  done: (translateX: number) => void
) => {
  const startX = ref<number>();
  const translateX = ref(0);

  const captureClick = (e: MouseEvent) => {
    e.stopPropagation();
    document.removeEventListener("click", captureClick, true);
  };

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
  };

  const endMoveListener = (e: MouseEvent | TouchEvent) => {
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    if (Math.abs(clientX - startX.value!) > 2) {
      document.addEventListener("click", captureClick, true);
    }
    done(translateX.value);
    stopMoving();
  };

  const moveListener = (e: MouseEvent | TouchEvent) => {
    const button = unref(b);
    if (!button) {
      return;
    }
    // We shouldn't go any further than the start of the parent element
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX.value!;
    const parentOffsetLeft = button.parentElement?.offsetLeft || 0;
    const offsetLeft = button.offsetLeft - parentOffsetLeft;
    const maxRight =
      button.parentElement!.scrollWidth - button.clientWidth - offsetLeft;
    translateX.value = Math.min(
      Math.max(-button.offsetLeft + parentOffsetLeft, diff),
      maxRight
    );
  };

  const startMoving = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    startX.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    document.addEventListener("touchmove", moveListener);
    document.addEventListener("mousemove", moveListener);
    document.addEventListener("touchend", endMoveListener);
    document.addEventListener("mouseup", endMoveListener);
    document.addEventListener("keydown", escapeListener);
  };

  return { moveListener: startMoving, translateX };
};
