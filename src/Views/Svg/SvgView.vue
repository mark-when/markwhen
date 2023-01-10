<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import type { Path, DateRange, Event } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { isEventNode } from "@markwhen/parser/lib/Noder";
import { useNodeStore } from "@/Views/Timeline/useNodeStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { computed, watch } from "vue";
import { eqPath } from "@/Markwhen/composables/useEventFinder";
import type { EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";
import EventRowSvg from "./EventRowSvg.vue";
import type { Node, SomeNode } from "@markwhen/parser/lib/Node";
import { useAppStore } from "@/App/appStore";

const nodeStore = useNodeStore();
const timelineStore = useTimelineStore();
const pageStore = usePageStore();
const editorOrchestrator = useEditorOrchestratorStore();
const appStore = useAppStore();

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
  node: node as Node<Event>,
  hovering: isHovering({ type: "pageFiltered", path }),
  path: path.join(","),
  numChildren: nodeStore.childrenMap.get(path.join(",")) || 0,
  numAbove: nodeStore.predecessorMap.get(path.join(",")) || 0,
  totalHeight: nodeStore.height,
  totalWidth: totalWidth.value,
  height: nodeStore.predecessorMap.get(path.join(","))!,
  heightUnit: heightUnit.value,
  earliestTime: DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime),
  latestTime: DateTime.fromISO(pageStore.pageTimelineMetadata.latestTime),
});

const isDark = computed(() => appStore.inferredDarkMode);
const vp = computed(() => timelineStore.pageSettings.viewport);
const additionalOffsetLeft = computed(() =>
  timelineStore.distanceFromBaselineLeftmostDate(
    DateTime.fromISO(pageStore.pageTimelineMetadata.earliestTime)
  )
);

const vpLeft = computed(
  () =>
    (vp.value.left - additionalOffsetLeft.value) / timelineStore.pageScaleBy24
);
const width = computed(() => vp.value.width / timelineStore.pageScaleBy24);
const styleLeftInset = computed(() => {
  let inset = timelineStore.pageSettings.viewport.offsetLeft;
  if (timelineStore.mode === "gantt") {
    return (
      inset +
      (timelineStore.ganttSidebarTempWidth
        ? timelineStore.ganttSidebarTempWidth
        : timelineStore.ganttSidebarWidth)
    );
  }
  return inset;
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`-${heightUnit} ${heightUnit * 1.5} ${
      totalWidth + heightUnit * 2
    } ${totalWidth}`"
    fill="currentColor"
    preserveAspectRatio="xMinYMin meet"
  >
    <template v-for="({ path, node }, index) in nodeStore.nodeArray">
      <EventRowSvg
        :key="path.join(',') + node.value.dateText"
        v-if="isEventNode(node) && !timelineStore.isCollapsedChild(path)"
        v-bind="props(path, node)"
      ></EventRowSvg>
    </template>
    <rect
      :x="vpLeft"
      :y="0"
      :width="width"
      height="150%"
      :fill="`rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0.1)`"
    ></rect>
  </svg>
</template>

<style scoped></style>
