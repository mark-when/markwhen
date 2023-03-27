import { parse } from "@markwhen/parser";
import { Cache } from "@markwhen/parser/lib/Cache";
import { defineStore } from "pinia";
import { computed, reactive, ref, shallowReactive, type Ref } from "vue";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { useParserWorker } from "./composables/useParserWorker";
import { exampleTimeline } from "@/exampleTimeline";

export const useMarkwhenStore = defineStore("markwhen", () => {
  const rawTimelineString = ref<string>(exampleTimeline);

  // const cache = reactive(new Cache());
  // const timelines = computed(
  //   () => parse(rawTimelineString.value, cache).timelines
  // );

  const useWorker = false;
  // console.log("using worker", useWorker);

  let timelines: Ref<Timeline[]>;
  const cache = shallowReactive(new Cache());
  if (useWorker) {
    timelines = useParserWorker(rawTimelineString).timelines;
    timelines.value = parse(rawTimelineString.value, cache).timelines;
  } else {
    timelines = computed(() => {
      // const start = performance.now();
      const r = parse(rawTimelineString.value, cache).timelines;
      // console.log("normal", performance.now() - start);
      return r;
    });
  }

  const setRawTimelineString = (s: string) => {
    rawTimelineString.value = s;
  };

  return {
    // state
    rawTimelineString,
    cache,

    // getters
    timelines,

    // actions
    setRawTimelineString,
  };
});
