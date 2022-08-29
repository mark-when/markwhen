<script setup lang="ts">
import { computed } from "vue";
import EventMarkdown from "../../Views/Timeline/Events/Event/EventMarkdown.vue";
import type { Event } from "@markwhen/parser/lib/Types";

const props = defineProps<{ event: Event }>();

const supplemental = computed(() => props.event.event.supplemental || []);
const matchedListItems = computed(
  () => props.event.event.matchedListItems || []
);
</script>

<template>
  <div class="px-3">
    <EventMarkdown
      :supplemental="supplemental"
      :matched-list-items="matchedListItems"
    />
  </div>
</template>

<style scoped></style>
