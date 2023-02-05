<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { computed } from "vue";
import JumpToRangeDialog from "@/Jump/JumpToRangeDialog.vue";

const timelineStore = useTimelineStore();

const showJumpToRange = computed({
  get() {
    return timelineStore.showingJumpToRange;
  },
  set(val) {
    timelineStore.setShowingJumpToRange(val);
  },
});
</script>

<template>
  <JumpToRangeDialog v-model="showJumpToRange" />
</template>

<style scoped></style>
