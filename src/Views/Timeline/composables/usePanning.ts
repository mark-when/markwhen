import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";

export const usePanning = (el: Ref<HTMLElement | undefined>) => {
  // panStartX is a ref as we're using it as a proxy
  // for whether we're currently panning
  let panStartX: Ref<null | number> = ref(null);
  let panStartY: null | number = null;
  let panStartScrollLeft: null | number = null;
  let panStartScrollTop: null | number = null;

  const endPanning = (e: MouseEvent) => {
    e.preventDefault();
    panStartX.value = null;
    panStartY = null;
    panStartScrollLeft = null;
    panStartScrollTop = null;
    window.removeEventListener("mousemove", panning);
    window.removeEventListener("mouseup", endPanning);
  };

  const panning = (e: MouseEvent) => {
    e.preventDefault();
    el.value!.scrollLeft = panStartScrollLeft! + panStartX.value! - e.clientX;
    el.value!.scrollTop = panStartScrollTop! + panStartY! - e.clientY;
  };

  const panStart = (e: MouseEvent) => {
    e.preventDefault();
    if (panStartX.value === null) {
      panStartScrollLeft = el.value!.scrollLeft;
      panStartScrollTop = el.value!.scrollTop;
      panStartX.value = e.clientX;
      panStartY = e.clientY;
    }
    window.addEventListener("mousemove", panning);
    window.addEventListener("mouseup", endPanning);
  };

  onMounted(() =>
    el.value ? el.value.addEventListener("mousedown", panStart) : {}
  );

  onUnmounted(() => el.value?.removeEventListener("mousedown", panStart));

  return { isPanning: computed(() => panStartX.value !== null) };
};
