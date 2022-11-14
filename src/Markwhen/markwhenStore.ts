import { parse } from "@markwhen/parser";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMarkwhenStore = defineStore("markwhen", () => {
  const rawTimelineString = ref<string>("");

  const timelines = computed(() => parse(rawTimelineString.value).timelines);

  const setRawTimelineString = (s: string) => {
    rawTimelineString.value = s;
  };

  return {
    // state
    rawTimelineString,

    // getters
    timelines,

    // actions
    setRawTimelineString,
  };
});
