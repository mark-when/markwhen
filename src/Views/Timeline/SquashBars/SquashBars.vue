<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import type { Node } from "@markwhen/parser/lib/Node";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import SquashBar from "./SquashBar.vue";

const transformStore = useTransformStore();

const flat = computed(() => {
  const eventsOnly: Node<Event>[] = [];
  const transformed = transformStore.transformedEvents;
  if (!transformed) {
    return eventsOnly;
  }
  for (const { node } of transformed) {
    if (node.isEventNode()) {
      eventsOnly.push(node as Node<Event>);
    }
  }
  return eventsOnly;
});
</script>

<template>
  <div
    class="left-0 right-0 h-2 transition fixed top-[3px] pointer-events-auto cursor-default"
  >
    <SquashBar
      v-for="e in flat"
      :key="e.eventValue().eventString"
      :event="e.eventValue()"
    />
  </div>
</template>

<style scoped></style>
