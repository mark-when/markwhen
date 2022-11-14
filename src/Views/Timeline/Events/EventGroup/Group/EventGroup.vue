<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import ExpandedGroup from "./ExpandedGroup.vue";
import CollapsedGroup from "./CollapsedGroup.vue";
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
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
  <expanded-group
    v-if="expanded"
    :path="props.path"
    :eventGroup="eventGroup"
    :left="left"
    :hovering="hovering"
    :canCalculateButton="canCalculateButton"
    @hovering="hovering = $event"
    @collapse="collapse"
  />
  <CollapsedGroup
    v-if="!expanded"
    :path="props.path"
    :group="eventGroup"
    :left="left"
    @expand="expanded = true"
  />
</template>

<style scoped></style>
