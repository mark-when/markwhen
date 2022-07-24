import { zoomer, type WheelGesture } from "../utilities/zoomer";
import { MAX_SCALE, useTimelineStore } from "@/timeline/timelineStore";

export const useGestures = (
  element: HTMLElement,
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

      pinchStartScrollTop = element.scrollTop;
      pinchStartScrollLeft = element.scrollLeft;
      pinchStartCenterX = wg.origin.x - element.offsetLeft;
      pinchStartCenterY = wg.origin.y;
    }
  };

  const doGesture = (wg: WheelGesture) => {
    if (startingZoom! * wg.scale > MAX_SCALE) {
      return;
    }

    const offsetLeft = (element as HTMLElement).offsetLeft;
    const newScrollLeft =
      wg.scale * (pinchStartScrollLeft! + pinchStartCenterX!) -
      (wg.origin.x! - offsetLeft);
    const newScrollTop =
      pinchStartScrollTop! + pinchStartCenterY! - wg.origin.y;

    element.scrollLeft = newScrollLeft;
    element.scrollTop = newScrollTop;

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
  endGesture = zoomer(element, gestures);
};
