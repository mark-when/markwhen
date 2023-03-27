import { emptyTimeline, type Timeline } from "@markwhen/parser/lib/Types";
import { ref, watch, type Ref } from "vue";

export const useParserWorker = (rawTimelineString: Ref<string>) => {
  const workerPath = "../../workers/parse.worker.ts";

  const timelines = ref<Timeline[]>([emptyTimeline()]);
  const isRunning = ref(false);
  const queuedString = ref(rawTimelineString.value);
  let timeStart = 0;

  const worker = new Worker(new URL(workerPath, import.meta.url), {
    type: "module",
  });

  watch(rawTimelineString, (s) => {
    queuedString.value = s;
    if (!isRunning.value) {
      isRunning.value = true;
      timeStart = performance.now();
      worker.postMessage({ rawTimelineString: queuedString.value });
    }
  });

  worker.addEventListener("message", (message) => {
    const { timelines: fromWorker, cache: c } = message.data;
    // console.log("parse time", performance.now() - timeStart);
    timelines.value = fromWorker;
    if (queuedString.value !== rawTimelineString.value) {
      worker.postMessage({ rawTimelineString: queuedString.value });
    } else {
      isRunning.value = false;
    }
    // cache = console.log(timelines, cache);
  });

  return { timelines };
};
