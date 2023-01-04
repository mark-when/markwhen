<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import NowLine from "../Events/NowLine.vue";
import { computed, inject, ref, watch } from "vue";
import { isEditable } from "@/injectionKeys";
import NewEvent from "./NewEvent/NewEvent.vue";
import { useNodeStore, nodeKey } from "../useNodeStore";
import EventNodeRow from "./EventNodeRow.vue";
import SectionNodeRow from "./SectionNodeRow.vue";
import type { Path } from "@markwhen/parser/lib/Types";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import GanttSidebar from "../Gantt/GanttSidebar.vue";

const timelineStore = useTimelineStore();

const editable = inject(isEditable);

const nodeStore = useNodeStore();

const height = computed(() => {
  const nodeArray = nodeStore.nodeArray;
  if (nodeArray.length) {
    return `${nodeArray.length * 30 + 500}px`;
  } else {
    return "100%";
  }
});

const eventsHeight = computed(() => {
  return nodeStore.nodes ? (nodeStore.childrenMap.get("") || 0) * 30 + 30 : 30;
});

const props = (path: Path, node: SomeNode) => ({
  node,
  path: path.join(","),
  numChildren: nodeStore.childrenMap.get(path.join(",")),
  numAbove: nodeStore.predecessorMap.get(path.join(",")) || 0,
});

const currentWidth = computed(() => {
  if (timelineStore.ganttSidebarTempWidth) {
    return timelineStore.ganttSidebarTempWidth;
  }
  return timelineStore.ganttSidebarWidth;
});
</script>

<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${timelineStore.distanceBetweenBaselineDates}px; height: ${height}`"
  >
    <now-line />
    <div class="flex w-full h-full z-[2]" v-if="timelineStore.mode === 'gantt'">
      <div
        class="sticky left-0 relative flex flex-col bg-slate-50 dark:bg-slate-700 top-0"
        :style="`width: calc(${currentWidth}px)`"
      ></div>
    </div>
    <template
      v-for="{ path, node } in nodeStore.visibleNodes[1]"
      :key="nodeStore.sectionKeys.get(path.join(','))"
    >
      <SectionNodeRow v-bind="props(path, node)"></SectionNodeRow>
    </template>
    <template
      v-for="{ path, node, key } in nodeStore.visibleNodes[0]"
      :key="key"
    >
      <EventNodeRow v-bind="props(path, node)"></EventNodeRow>
    </template>
    <!-- <new-event v-if="editable" /> -->
    <div class="absolute left-0 right-0 h-full pointer-events-none"></div>
    <GanttSidebar />
  </div>
</template>

<style scoped></style>
