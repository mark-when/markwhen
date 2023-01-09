<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import type { Path, DateRange } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { useTimelineStore } from "../timelineStore";
import { isEventNode } from "@markwhen/parser/lib/Noder";
import { useNodeStore } from "../useNodeStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { computed } from "vue";
import { eqPath } from "@/Markwhen/composables/useEventFinder";
import type { EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";
import EventRowSvg from "./EventRowSvg.vue";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { useAppStore } from "@/App/appStore";

const nodeStore = useNodeStore();
const timelineStore = useTimelineStore();
const pageStore = usePageStore();
const editorOrchestrator = useEditorOrchestratorStore();
const appStore = useAppStore();

const left = (range: DateRange) =>
  timelineStore.scalelessDistanceBetweenDates(
    timelineStore.baselineLeftmostDate,
    range.fromDateTime
  );

const width = (range: DateRange) => {
  // console.log(range.fromDateTime, range.toDateTime);
  const t = timelineStore.scalelessDistanceBetweenDates(
    range.fromDateTime,
    range.toDateTime
  );

  return t;
};

const hovering = computed(() => editorOrchestrator.hoveringEventPaths);
const isHovering = (p: EventPath) => {
  return hovering.value && eqPath(p, hovering.value);
};

const totalWidth = computed(() =>
  timelineStore.scalelessDistanceBetweenDates(
    DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime),
    DateTime.fromISO(pageStore.pageTimelineMetadata.latestTime)
  )
);

const heightUnit = computed(() => totalWidth.value / nodeStore.height);

const props = (path: Path, node: SomeNode) => ({
  node,
  hovering: isHovering({ type: "pageFiltered", path }),
  path: path.join(","),
  numChildren: nodeStore.childrenMap.get(path.join(",")),
  numAbove: nodeStore.predecessorMap.get(path.join(",")) || 0,
  totalHeight: nodeStore.height,
  totalWidth: totalWidth.value,
  height: nodeStore.predecessorMap.get(path.join(",")),
  heightUnit: heightUnit.value,
  earliestTime: DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime),
  latestTime: DateTime.fromISO(pageStore.pageTimelineMetadata.latestTime),
});

const isDark = computed(() => appStore.inferredDarkMode);
const vp = computed(() => timelineStore.pageSettings.viewport);
const vpLeft = computed(
  () =>
    timelineStore.pageSettings.viewport.left -
    timelineStore.scalelessDistanceBetweenDates(
      timelineStore.baselineLeftmostDate,
      DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime)
    )
);
</script>

<template>
  <div
    class="sticky bottom-8 inline-block dark:bg-slate-800 bg-slate-100 shadow-lg rounded-lg overflow-scroll p-2"
    :style="`left: calc(${timelineStore.leftInsetWidth}px + 2rem);`"
  >
    <svg
      style="width: 8rem; height: 8rem"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`-${heightUnit} ${heightUnit * 1.5} ${
        totalWidth + heightUnit * 2
      } ${totalWidth}`"
      fill="currentColor"
      preserveAspectRatio="xMinYMin meet"
    >
      <template v-for="({ path, node }, index) in nodeStore.nodeArray">
        <EventRowSvg
          :key="path.join(',')"
          v-if="isEventNode(node)"
          v-bind="props(path, node)"
        ></EventRowSvg>
      </template>
    </svg>
  </div>
</template>

<style scoped></style>
