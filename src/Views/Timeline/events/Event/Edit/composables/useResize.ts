import { useAppStore } from "@/App/appStore";
import {
  EDIT_EVENT_DATE_RANGE,
  useEditorOrchestratorStore,
} from "@/EditorOrchestrator/editorOrchestratorStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import {
  floorDateTime,
  roundDateTime,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import { Event } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import type { DateTime } from "luxon";
import { ref, unref } from "vue";

export const useResize = (event: MaybeRef<Event>) => {
  const isFrom = ref<boolean>(true);
  const tempDate = ref<DateTime>();
  const ev = unref(event);

  const markersStore = useMarkersStore();
  const timelineStore = useTimelineStore();
  const appStore = useAppStore();
  const editorOrchestrator = useEditorOrchestratorStore();

  const upListener = (e: MouseEvent | TouchEvent) => {
    if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
    } else {
      e.preventDefault();
    }

    if (tempDate.value && ev) {
      if (+tempDate.value > +ev.ranges.date.toDateTime) {
        editorOrchestrator.update(EDIT_EVENT_DATE_RANGE, {
          event,
          from: ev.ranges.date.toDateTime,
          to: tempDate.value,
        });
      } else {
        editorOrchestrator.update(EDIT_EVENT_DATE_RANGE, {
          event,
          from: tempDate.value,
          to: ev.ranges.date.toDateTime,
        });
      }
    }

    tempDate.value = undefined;

    document.removeEventListener("mousemove", moveListener);
    document.removeEventListener("mouseup", upListener);
    document.removeEventListener("touchmove", moveListener);
    document.removeEventListener("touchend", upListener);

    appStore.clearGlobalClass();
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
