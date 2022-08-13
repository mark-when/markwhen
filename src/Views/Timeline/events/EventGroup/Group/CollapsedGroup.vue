<script setup lang="ts">
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import { EventDescription } from "@markwhen/parser/lib/Types";
import { computed, ref } from "vue";
import { useEventColor } from "../../composables/useEventColor";
import GroupOrSectionVue from "../GroupOrSection.vue";

const props = defineProps<{ group: EventSubGroup; left: number }>();

const { distanceBetweenDates } = useTimelineStore();

const hovering = ref(false);
const { color } = useEventColor(props.group);
const titleHtml = computed(() =>
  EventDescription.toInnerHtml(props.group.title || "")
);
const fullWidth = computed(() => {
  if (!props.group || !props.group.range) {
    return 100;
  }
  const { min, latest } = props.group.range;
  return distanceBetweenDates(min, latest);
});
</script>

<template>
  <div
    :style="{
      marginLeft: `${left - 8}px`,
      width: `max(64px, ${fullWidth + 16}px)`,
      backgroundColor:
        (color && `rgba(${color}, ${hovering ? 0.3 : 0.2})`) || '',
      outline: (color && `1px solid rgba(${color}, 0.3)`) || '',
    }"
    :class="{
      'bg-gray-400 dark:bg-gray-800 outline outline-1 dark:outline-gray-900/25 outline-gray-400/25':
        !color,
    }"
    class="rounded-full transition bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-30 hover:dark:bg-opacity-40"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <button class="w-full eventTitle pl-2" @click="$emit('expand')">
      <span v-if="group.title" v-html="titleHtml" class=""></span>
      ({{ group.length }})
    </button>
  </div>
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
