import { zoomer, type WheelGesture } from "../utilities/zoomer";
import { MAX_SCALE, useTimelineStore } from "@/timeline/timelineStore";
import { onMounted, type Ref } from "vue";

export const useGestures = (
  el: Ref<HTMLElement | null>,
  onSetScale: () => void = () => {}
) => {
  const timelineStore = useTimelineStore();

  let endGesture = () => {};
  let startingZoom: number | null = null;
  let pinchStartScrollTop: number | null,
    pinchStartScrollLeft: number | null,
    pinchStartCenterX: number | null,
    pinchStartCenterY: number | null;

  const startGesture = (wg: WheelGesture) => {
    if (!startingZoom) {
      startingZoom = timelineStore.pageScale;

      pinchStartScrollTop = el.value!.scrollTop;
      pinchStartScrollLeft = el.value!.scrollLeft;
      pinchStartCenterX = wg.origin.x - el.value!.offsetLeft;
      pinchStartCenterY = wg.origin.y;
    }
  };

  const doGesture = (wg: WheelGesture) => {
    if (startingZoom! * wg.scale > MAX_SCALE) {
      return;
    }

    const offsetLeft = (el.value! as HTMLElement).offsetLeft;
    const newScrollLeft =
      wg.scale * (pinchStartScrollLeft! + pinchStartCenterX!) -
      (wg.origin.x! - offsetLeft);
    const newScrollTop =
      pinchStartScrollTop! + pinchStartCenterY! - wg.origin.y;

    el.value!.scrollLeft = newScrollLeft;
    el.value!.scrollTop = newScrollTop;

    timelineStore.setPageScale(startingZoom! * wg.scale);
    onSetScale();

    startingZoom = null;
    // pinchStartScrollLeft = null;
    pinchStartScrollTop = null;
    pinchStartCenterX = null;
    pinchStartCenterY = null;

    endGesture();
  };

  const gestures = {
    startGesture,
    doGesture,
  };

  onMounted(() => {
    endGesture = zoomer(el.value!, gestures);
  });
};
