import { useAppStore } from "@/App/appStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import {
  diffScale,
  floorDateTime,
  roundDateTime,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { Event } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import type { DateTime } from "luxon";
import { ref, unref } from "vue";

export const useResize = (
  event: MaybeRef<Event>,
  done?: (tempFrom: DateTime | undefined, tempTo: DateTime | undefined) => void
) => {
  const tempFrom = ref<DateTime>();
  const tempTo = ref<DateTime>();
  const diff = ref<number>();

  const markersStore = useMarkersStore();
  const timelineStore = useTimelineStore();
  const appStore = useAppStore();

  const stop = () => {
    tempFrom.value = undefined;
    tempTo.value = undefined;

    document.removeEventListener("mousemove", moveListenerLeft);
    document.removeEventListener("mousemove", moveListenerRight);
    document.removeEventListener("mousemove", moveListener);

    document.removeEventListener("mouseup", upListener);
    document.removeEventListener("mouseup", moveEnd);

    document.removeEventListener("touchmove", moveListenerLeft);
    document.removeEventListener("touchmove", moveListenerRight);
    document.removeEventListener("touchmove", moveListener);

    document.removeEventListener("touchend", upListener);
    document.removeEventListener("touchend", moveEnd);

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

    done?.(tempFrom.value, tempTo.value);
    stop();
  };

  const moveListenerLeft = (e: MouseEvent | TouchEvent) => {
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

    tempFrom.value = floored;
  };

  const moveListenerRight = (e: MouseEvent | TouchEvent) => {
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

    tempTo.value = floored;
  };

  const dragHandleListenerLeft = (e: MouseEvent | TouchEvent) => {
    document.addEventListener("mousemove", moveListenerLeft);
    document.addEventListener("mouseup", upListener);
    document.addEventListener("touchmove", moveListenerLeft);
    document.addEventListener("touchend", upListener);
    document.addEventListener("keydown", escapeListener);

    appStore.setGlobalClass("pointer-events-none cursor-ew-resize");
  };

  const dragHandleListenerRight = (e: MouseEvent | TouchEvent) => {
    document.addEventListener("mousemove", moveListenerRight);
    document.addEventListener("mouseup", upListener);
    document.addEventListener("touchmove", moveListenerRight);
    document.addEventListener("touchend", upListener);
    document.addEventListener("keydown", escapeListener);

    appStore.setGlobalClass("pointer-events-none cursor-ew-resize");
  };

  const moveListener = (e: MouseEvent | TouchEvent) => {
    let x;
    if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
      x = e.touches[0].clientX;
    } else {
      e.preventDefault();
      x = (e as MouseEvent).clientX;
    }
    // + 18 because of where the handle is
    const date = timelineStore.dateFromClientLeft(x + 18) as DateTime;
    const rounded = roundDateTime(
      date,
      markersStore.nextMostGranularScaleOfViewportDateInterval
    );
    tempFrom.value = rounded;
    tempTo.value = rounded.plus({ [diffScale]: diff.value });
  };

  const moveEnd = (e: MouseEvent | TouchEvent) => {
    if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
    } else {
      e.preventDefault();
    }
    done?.(tempFrom.value, tempTo.value);
    stop();
  };

  const moveHandleListener = (e: MouseEvent | TouchEvent) => {
    tempFrom.value = unref(event).ranges.date.fromDateTime;
    tempTo.value = unref(event).ranges.date.toDateTime;
    diff.value = tempTo.value.diff(tempFrom.value).as(diffScale);

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("touchmove", moveListener);
    document.addEventListener("mouseup", moveEnd);
    document.addEventListener("touchend", moveEnd);
    document.addEventListener("keydown", escapeListener);

    appStore.setGlobalClass("pointer-events-none cursor-ew-resize");
  };

  return {
    dragHandleListenerLeft,
    dragHandleListenerRight,
    moveHandleListener,
    tempFrom,
    tempTo,
  };
};
