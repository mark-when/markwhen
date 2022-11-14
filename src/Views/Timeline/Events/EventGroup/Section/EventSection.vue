<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import ExpandedSection from "./ExpandedSection.vue";
import CollapsedSection from "./CollapsedSection.vue";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";

const { distanceFromBaselineLeftmostDate } = useTimelineStore();

const props = defineProps<{ eventGroup: EventSubGroup; path: EventPath }>();
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
  <div class="">
    <expanded-section
      v-if="expanded"
      :path="props.path"
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
  </div>
</template>

<style scoped></style>
