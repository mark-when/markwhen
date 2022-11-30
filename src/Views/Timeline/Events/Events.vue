<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import NowLine from "../Events/NowLine.vue";
import { computed, inject } from "vue";
import NodeRow from "./NodeRow.vue";
import type { NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { isEditable } from "@/injectionKeys";
import NewEvent from "./NewEvent/NewEvent.vue";
import type { Block } from "@markwhen/parser/lib/Types";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();

// top level is always an array
const nodes = computed(
  () => transformStore.transformedEvents?.value as NodeArray
);

const editable = inject(isEditable);

const nodeKey = (n: SomeNode) => {
  if (n.isEventNode()) {
    const event = n.eventValue().event;
    return (
      event.eventDescription +
      event.supplemental
        .filter((b) => b.type !== "image")
        .map((b) => (b as Block).raw)
        .join(" ")
    );
  } else {
    return n.title;
  }
};
</script>

<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${timelineStore.distanceBetweenBaselineDates}px;`"
  >
    <div class="h-24"></div>
    <now-line />
    <NodeRow
      v-for="(node, i) in nodes"
      :key="nodeKey(node)"
      :node="node"
      :path="`${i}`"
      :can-have-sections="true"
    ></NodeRow>
    <new-event v-if="editable" />
    <div style="height: 85vh"></div>
  </div>
</template>

<style scoped></style>
