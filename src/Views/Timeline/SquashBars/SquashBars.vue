<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import type { Node } from "@markwhen/parser/lib/Node";
import { isEventNode, iterate, eventValue } from "@markwhen/parser/lib/Noder";
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
  for (const { node } of iterate(transformed)) {
    if (isEventNode(node)) {
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
      :key="eventValue(e).eventString"
      :event="eventValue(e)"
    />
  </div>
</template>

<style scoped></style>
