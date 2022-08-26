<script setup lang="ts">
import { computed } from "vue";
import { useEventDetailStore } from "./eventDetailStore";
import EventMarkdown from "../../Views/Timeline/Events/Event/EventMarkdown.vue";

const eventDetailStore = useEventDetailStore();

const ev = computed(() => eventDetailStore.detailEvent);

const supplemental = computed(() => ev.value?.event.supplemental || []);
const matchedListItems = computed(() => ev.value?.event.matchedListItems || []);
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
