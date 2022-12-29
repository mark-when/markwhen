<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import NowLine from "../Events/NowLine.vue";
import { computed, inject, watch } from "vue";
import { isEditable } from "@/injectionKeys";
import NewEvent from "./NewEvent/NewEvent.vue";
import { useMaps, nodeKey } from "./composables/useMaps";
import EventNodeRow from "./EventNodeRow.vue";
import SectionNodeRow from "./SectionNodeRow.vue";
import { getLast } from "@markwhen/parser/lib/Noder";

const timelineStore = useTimelineStore();

const editable = inject(isEditable);

const { nodes, nodeArray, visibleNodes, childrenMap, predecessorMap } =
  useMaps();

const height = computed(() => {
  if (nodeArray.value.length) {
    return `${nodeArray.value.length * 30 + 500}px`;
  } else {
    return "100%";
  }
});

const eventsHeight = computed(() => {
  const count =
    nodeArray.value && nodeArray.value.length
      ? predecessorMap.value.get(
          nodeArray.value[nodeArray.value.length - 1].path.join(",")
        ) || 0
      : 0;
  return 30 + count * 30;
});
</script>

<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${timelineStore.distanceBetweenBaselineDates}px; height: ${height}`"
  >
    <div class="h-24"></div>
    <now-line />
    <template
      v-for="{ path, node } of visibleNodes[1]"
      :key="path + nodeKey(node)"
    >
      <SectionNodeRow
        :node="node"
        :path="path.join(',')"
        :numChildren="childrenMap.get(path.join(','))"
        :numAbove="predecessorMap.get(path.join(',')) || 0"
      ></SectionNodeRow>
    </template>
    <template
      v-for="{ path, node } of visibleNodes[0]"
      :key="path + nodeKey(node)"
    >
      <EventNodeRow
        :node="node"
        :path="path.join(',')"
        :numChildren="childrenMap.get(path.join(','))"
        :numAbove="predecessorMap.get(path.join(',')) || 0"
      ></EventNodeRow>
    </template>
    <new-event v-if="editable" :style="{ top: `${eventsHeight}px` }" />
    <div style="height: 85vh"></div>
  </div>
</template>

<style scoped></style>
