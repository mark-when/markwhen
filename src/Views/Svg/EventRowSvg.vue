<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import type { DateTime } from "luxon";
import { computed, type Ref } from "vue";
import { useEventRefs } from "@/Views/Timeline/Events/useEventRefs";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useAppStore } from "@/App/appStore";

const appStore = useAppStore();

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
  dark: boolean;
  scale: number;
}>();

const { scalelessDistanceBetweenDates: dist } = useTimelineStore();

const { color, eventRange } = useEventRefs(props.node.value);

const range = computed(() => toDateRange(eventRange.value!));

const leftX = computed(
  () => dist(props.earliestTime, range.value.fromDateTime) * props.scale
);

const width = computed(() =>
  dist(range.value.fromDateTime, range.value.toDateTime) * props.scale
);

const d = computed(() => {
  const bottom = (props.height / props.totalHeight) * props.totalWidth;
  const top = bottom + props.totalWidth / props.totalHeight;

  const rightX = (leftX.value + width.value);
  const bottomY = top - props.heightUnit / 4;
  const topY = bottom + props.heightUnit / 4;
  return `M ${rightX} ${bottomY} A 1 1 0 0 0 ${rightX} ${topY} L ${leftX.value} ${topY} A 1 1 0 0 0 ${leftX.value} ${bottomY} Z`;
});
</script>

<template>
  <path
    fill-rule="evenodd"
    :d="d"
    :fill="`rgba(${color || (dark ? '255, 255, 255' : '0, 0, 0')}, 0.8)`"
    :stroke="`rgb(${color || (dark ? '255, 255, 255' : '0, 0, 0')})`"
    :stroke-width="heightUnit / 10"
  ></path>
</template>

<style scoped></style>
