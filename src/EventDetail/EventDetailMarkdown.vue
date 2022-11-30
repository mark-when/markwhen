<script setup lang="ts">
import { computed } from "vue";
import EventMarkdown from "../Views/Timeline/Events/Event/EventMarkdown.vue";
import type { Event } from "@markwhen/parser/lib/Types";

const props = defineProps<{ event: Event }>();

const supplemental = computed(
  () => props.event.eventDescription.supplemental || []
);
const matchedListItems = computed(
  () => props.event.eventDescription.matchedListItems || []
);
</script>

<template>
  <div class="px-3 overflow-scroll">
    <EventMarkdown
      :supplemental="supplemental"
      :matched-list-items="matchedListItems"
    />
  </div>
</template>

<style scoped></style>
