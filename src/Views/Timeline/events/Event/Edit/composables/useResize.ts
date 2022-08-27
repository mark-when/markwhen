import { useAppStore } from "@/App/appStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { floorDateTime } from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { Event } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import type { DateTime } from "luxon";
import { ref } from "vue";

export const useResize = (
  event: MaybeRef<Event>,
  done?: (tempDate?: DateTime) => void
) => {
  const isFrom = ref<boolean>(true);
  const tempDate = ref<DateTime>();

  const markersStore = useMarkersStore();
  const timelineStore = useTimelineStore();
  const appStore = useAppStore();

  const stop = () => {
    tempDate.value = undefined;

    document.removeEventListener("mousemove", moveListener);
    document.removeEventListener("mouseup", upListener);
    document.removeEventListener("touchmove", moveListener);
    document.removeEventListener("touchend", upListener);
    document.removeEventListener("keydown", escapeListener);

    appStore.clearGlobalClass();
  };

  const escapeListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      stop();
    }
  };

  const upListener = (e: MouseEvent | TouchEvent) => {
    if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
    } else {
      e.preventDefault();
    }

    done?.(tempDate.value);
    stop();
  };

  const moveListener = (e: MouseEvent | TouchEvent) => {
    let x;
    if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
      x = e.touches[0].clientX;
    } else {
      x = (e as MouseEvent).clientX;
      e.preventDefault();
    }
    const date = timelineStore.dateFromClientLeft(x);
    const floored = floorDateTime(
      date,
      markersStore.nextMostGranularScaleOfViewportDateInterval
    );

    tempDate.value = floored;
  };

  const mouseDownTouchStartListener =
    (from: boolean) => (e: MouseEvent | TouchEvent) => {
      isFrom.value = from;

      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("touchend", upListener);
      document.addEventListener("keydown", escapeListener);

      appStore.setGlobalClass("pointer-events-none cursor-ew-resize");
    };

  return {
    mouseDownTouchStartListener: mouseDownTouchStartListener as (
      from: boolean
    ) => EventListener,
    tempDate,
    isFrom,
  };
};
