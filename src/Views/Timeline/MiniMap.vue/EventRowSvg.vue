<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import type { DateTime } from "luxon";
import { computed, type Ref } from "vue";
import { useEventRefs } from "../Events/useEventRefs";
import { useTimelineStore } from "../timelineStore";

const props = defineProps<{
  node: Node<Event>;
  hovering?: boolean;
  path: string;
  numChildren: number;
  numAbove: number;
  totalHeight: number;
  totalWidth: number;
  height: number;
  earliestTime: DateTime;
  latestTime: DateTime;
  heightUnit: number;
}>();

const { scalelessDistanceBetweenDates: dist } = useTimelineStore();

const { color, eventRange } = useEventRefs(props.node.value);

const range = computed(() => toDateRange(eventRange.value!));

const left = computed(() => dist(props.earliestTime, range.value.fromDateTime));

const width = computed(() =>
  dist(range.value.fromDateTime, range.value.toDateTime)
);

const d = computed(() => {
  const bottom = (props.height / props.totalHeight) * props.totalWidth;
  const top = bottom + props.totalWidth / props.totalHeight;

  return `M ${left.value + width.value} ${
    top - props.heightUnit / 4
  } A 1 1 0 0 0 ${left.value + width.value} ${
    bottom + props.heightUnit / 4
  } L ${left.value} ${bottom + props.heightUnit / 4} A 1 1 0 0 0 ${
    left.value
  } ${top - props.heightUnit / 4} Z`;
});
</script>

<template>
  <path
    fill-rule="evenodd"
    :d="d"
    :fill="`rgba(${color}, 0.8)`"
    :stroke="`rgb(${color})`"
    :stroke-width="heightUnit / 10"
  ></path>
</template>

<style scoped></style>
