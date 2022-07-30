<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useTimelineStore } from "@/Timeline/timelineStore";
import ExpandedSection from "./ExpandedSection.vue";
import CollapsedSection from "./CollapsedSection.vue";

const { distanceFromBaselineLeftmostDate } = useTimelineStore();

const props = defineProps<{ eventGroup: EventSubGroup }>();
const eventGroup = props.eventGroup;

const expanded = ref(!!eventGroup.startExpanded);
const hovering = ref(false);
const canCalculateButton = ref(false);

function collapse(e: MouseEvent) {
  if (e.target instanceof HTMLAnchorElement) {
    return;
  }
  e.preventDefault();
  expanded.value = false;
}

const left = computed(() => {
  if (!eventGroup || !eventGroup.range) {
    return 10;
  }
  return distanceFromBaselineLeftmostDate(eventGroup.range.min);
});

onMounted(() => {
  canCalculateButton.value = expanded.value;
});

watch(expanded, (val) => {
  nextTick(() => {
    canCalculateButton.value = val;
  });
});
</script>

<template>
  <expanded-section
    v-if="expanded"
    :group="eventGroup"
    :left="left"
    :hovering="hovering"
    @hovering="hovering = $event"
    @collapse="expanded = !expanded"
  />
  <CollapsedSection
    v-else
    :group="eventGroup"
    :left="left"
    @expand="expanded = !expanded"
  />
</template>

<style scoped></style>
