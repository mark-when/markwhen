<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import NowLine from "../Events/NowLine.vue";
import { computed, inject } from "vue";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { isEditable } from "@/injectionKeys";
import NewEvent from "./NewEvent/NewEvent.vue";
import type { Path } from "@markwhen/parser/lib/Types";
import { toArray } from "@markwhen/parser/lib/Noder";
import Nodes from "./Nodes.vue";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();

// top level is always an array
const nodes = computed(() => transformStore.transformedEvents);

const nodeArray = computed(
  () => toArray(nodes.value) as { path: Path; node: SomeNode }[]
);

const editable = inject(isEditable);

const height = computed(() => {
  if (nodeArray.value.length) {
    return `${nodeArray.value.length * 30 + 500}px`;
  } else {
    return "100%";
  }
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
    <Nodes />
    <new-event v-if="editable" />
    <div style="height: 85vh"></div>
  </div>
</template>

<style scoped></style>
