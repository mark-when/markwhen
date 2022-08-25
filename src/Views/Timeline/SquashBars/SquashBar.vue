<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useEventColor } from "../Events/composables/useEventColor";
import { useTimelineStore } from "../timelineStore";
import { viewportLeftMarginPixels } from "../utilities/dateTimeUtilities";

const props = defineProps<{ event: Event }>();

const editorOrchestrator = useEditorOrchestratorStore();
const { distanceFromViewportLeftDate } = useTimelineStore();

const dateLeft = computed(
  () =>
    distanceFromViewportLeftDate(props.event.ranges.date.fromDateTime) -
    viewportLeftMarginPixels
);
const dateRight = computed(
  () =>
    distanceFromViewportLeftDate(props.event.ranges.date.toDateTime) -
    viewportLeftMarginPixels
);
const hoveredInEditor = computed(() =>
  editorOrchestrator.isEventHoveredInEditor(props.event)
);

const hover = ref(false);

const edit = () => {};

const { color } = useEventColor(props.event);
</script>

<template>
  <div
    class="h-[6px] fixed transition cursor-pointer transition rounded-full"
    :class="{
      'dark:bg-slate-400 bg-slate-700 dark:border-white':
        !color && (hover || hoveredInEditor),
      'dark:bg-slate-400/30 bg-slate-700/30 hover:dark:bg-slate-400 hover:bg-slate-700 dark:border-white':
        !color && !(hover || hoveredInEditor),
    }"
    :style="{
      marginLeft: `${dateLeft}px`,
      width: `max(0.5rem, ${dateRight - dateLeft}px)`,
      backgroundColor: color
        ? `rgba(${color}, ${hover || hoveredInEditor ? 0.9 : 0.2})`
        : 'unset',
    }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="edit"
  ></div>
</template>

<style scoped></style>
