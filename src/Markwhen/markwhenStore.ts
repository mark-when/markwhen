import { parse } from "@markwhen/parser";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMarkwhenStore = defineStore("markwhen", () => {
  const rawTimelineString = ref<string>(`
  title: this is the title
  
  2022: hello world #hi
  how is it going
  
  group Group 1
  1990/2030: 40 years #tag2`);

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
