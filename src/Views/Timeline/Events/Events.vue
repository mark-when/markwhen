<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventRow from "@/Views/Timeline/Events/Event/EventRow.vue";
import { useTransformStore } from "@/Markwhen/transformStore";
import EventSection from "@/Views/Timeline/Events/EventGroup/Section/Section.vue";
import EventGroup from "@/Views/Timeline/Events/EventGroup/Group/EventGroup.vue";
import NowLine from "../Events/NowLine.vue";
import { isEditable } from "@/injectionKeys";
import { computed, inject } from "vue";
import NewEvent from "./NewEvent/NewEvent.vue";
import NodeRow from "./NodeRow.vue";
import type { Node } from "@markwhen/parser/lib/Node";
import { usePageStore } from "@/Markwhen/pageStore";
import Section from "@/Views/Timeline/Events/EventGroup/Section/Section.vue";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();

const editable = inject(isEditable);
const type = "pageFiltered" as "pageFiltered";

// top level is always an array
const nodes = computed(
  () => usePageStore().pageTimeline.events.value as Array<Node>
);
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
      :node="node"
      :path="[i]"
      :can-have-sections="true"
    ></NodeRow>
    <!-- <new-event v-if="editable" /> -->
    <div style="height: 85vh"></div>
  </div>
</template>

<style scoped></style>
