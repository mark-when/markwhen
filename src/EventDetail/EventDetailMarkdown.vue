<script setup lang="ts">
import EventMarkdown from "../Views/Timeline/Events/Event/EventMarkdown.vue";
import type { MarkdownBlock, Range } from "@markwhen/parser/lib/Types";

const props = defineProps<{
  markdownBlocks: MarkdownBlock[];
  matchedListItems: Range[];
}>();
</script>

<template>
  <div class="px-3 overflow-scroll text-base">
    <EventMarkdown
      :supplemental="markdownBlocks"
      :matched-list-items="matchedListItems"
    />
  </div>
</template>

<style scoped></style>
