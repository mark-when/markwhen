import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import {
  ceilDateTime,
  floorDateTime,
} from "@/Markwhen/utilities/dateTimeUtilities";
import { parseDateRange } from "@markwhen/parser";
import {
  toDateRange,
  type DateRange,
  type DateRangeIso,
} from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { dateRangeToString } from "@/Markwhen/utilities/dateRangeToString2";

export type EventCreationParams = {
  title?: string;
  description?: string;
  range?: DateRangeIso | string;
};

export const todayRange = () => ({
  fromDateTime: floorDateTime(DateTime.now(), "day"),
  toDateTime: ceilDateTime(DateTime.now(), "day"),
});

export const useNewEventStore = defineStore("newEvent", () => {
  const editorOrchestrator = useEditorOrchestratorStore();

  const showing = ref(false);

  const range = ref<DateRange>(todayRange());
  const title = ref<string>("Event");
  const details = ref<string>("");

  const setShowing = (show: boolean) => {
    showing.value = false;
  };

  const setTitle = (t: string) => {
    title.value = t;
  };

  const setDetails = (t: string) => {
    details.value = t;
  };

  const prompt = (params?: EventCreationParams) => {
    reset();
    if (params) {
      if (params.title) {
        title.value = params.title;
      }
      if (params.description) {
        details.value = params.description;
      }
      if (params.range) {
        if (typeof params.range === "string") {
          range.value = parseDateRange(`${params.range}:`) || todayRange();
        } else {
          range.value = toDateRange(params.range);
        }
      }
    }
    showing.value = true;
  };

  const reset = () => {
    title.value = "Event";
    range.value = todayRange();
    details.value = "";
  };

  const createEventWithValues = () => {
    editorOrchestrator.createEvent({
      title: title.value,
      range: dateRangeToString(range.value),
      description: details.value,
    });
  };

  const setRange = (dateRange: DateRange) => {
    range.value = dateRange;
  };

  return {
    showing,
    title,
    details,
    range,
    setRange,
    setDetails,
    setTitle,
    setShowing,
    prompt,
    reset,
    createEventWithValues,
  };
});
