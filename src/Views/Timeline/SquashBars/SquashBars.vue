<script setup lang="ts">
import { useTransformStore } from "@/Markwhen/transformStore";
import { Event, type EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed } from "vue";
import SquashBar from "./SquashBar.vue";

const transformStore = useTransformStore();

const transformed = transformStore.transformedEvents;

const flat = computed(() =>
  transformStore.transformedEvents.flatMap((e: Event | EventSubGroup) =>
    e instanceof Event ? [e] : e
  )
);
</script>

<template>
  <div
    class="left-0 right-0 h-2 transition fixed top-[3px] pointer-events-auto cursor-default"
  >
    <SquashBar v-for="e in flat" :key="e.eventString" :event="e" />
  </div>
</template>

<style scoped></style>
