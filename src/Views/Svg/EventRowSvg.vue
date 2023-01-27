<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import type { DateTime } from "luxon";
import { computed, ref } from "vue";
import { useEventRefs } from "@/Views/Timeline/Events/useEventRefs";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { expand } from "@markwhen/parser/lib/utilities/recurrence";
import { recurrenceLimit } from "@/Markwhen/pageStore";

const props = defineProps<{
  node: Node<Event>;
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
  showDateText: boolean;
  showEventTitles: boolean;
  rowHeight: number;
  roundedLeft: boolean;
  roundedRight: boolean;
}>();

const { scalelessDistanceBetweenDates: dist } = useTimelineStore();

const { color, eventRange, dateText } = useEventRefs(props.node.value);

const range = computed(() => toDateRange(eventRange.value!));

const recurrence = computed(() => props.node.value.recurrence);
const expandedRecurrence = computed(() =>
  (recurrence.value
    ? expand(range.value, recurrence.value, recurrenceLimit)
    : [range.value]
  ).map((dr) => dist(props.earliestTime, dr.fromDateTime) * props.scale)
);

const width = computed(
  () => dist(range.value.fromDateTime, range.value.toDateTime) * props.scale
);

const bottom = computed(
  () => (props.height / props.totalHeight) * props.totalWidth
);
const top = computed(() => bottom.value + props.totalWidth / props.totalHeight);
// const barRightX = computed(() => leftX.value + width.value);
const barBottomY = computed(
  () => top.value - props.heightUnit / ((4 * props.rowHeight) / 3)
);
const barTopY = computed(
  () => bottom.value + props.heightUnit / ((4 * props.rowHeight) / 3)
);

const d = (left: number) => {
  const arcRadius = (barBottomY.value - barTopY.value) / 2;
  const rightLineCap = props.roundedRight
    ? `A ${arcRadius} ${arcRadius} 0 0 0`
    : `L`;
  const leftLineCap = props.roundedLeft
    ? `A ${arcRadius} ${arcRadius} 0 0 0`
    : "L";
  return `M ${left + width.value} ${barBottomY.value} ${rightLineCap} ${
    left + width.value
  } ${barTopY.value} L ${left} ${barTopY.value} ${leftLineCap} ${left} ${
    barBottomY.value
  } Z`;
};

const barsRightmostX = computed(() => {
  const rightmost =
    expandedRecurrence.value[expandedRecurrence.value.length - 1] + width.value;
  console.log(rightmost);
  return rightmost;
});

const text = ref<SVGTextElement>();
const getRightmostX = () =>
  barsRightmostX.value + (text.value?.getComputedTextLength() || 0);

const strokeWidth = computed(() => props.heightUnit / 10);

defineExpose({
  getRightmostX,
});
</script>

<template>
  <path
    v-for="left in expandedRecurrence"
    fill-rule="evenodd"
    :d="d(left)"
    :fill="`rgba(${color || (dark ? '255, 255, 255' : '0, 0, 0')}, 0.8)`"
    :stroke="`rgb(${color || (dark ? '255, 255, 255' : '0, 0, 0')})`"
    :stroke-width="strokeWidth"
  ></path>
  <text :x="barsRightmostX" :y="barBottomY" ref="text"
    ><tspan class="svgDateText">&nbsp;&nbsp;</tspan
    ><tspan v-if="showDateText" class="svgDateText"
      >&nbsp;&nbsp;{{ dateText }}</tspan
    ><tspan v-if="showEventTitles" class="svgEventTitle"
      >&nbsp;&nbsp;{{ node.value.eventDescription.eventDescription }}</tspan
    ></text
  >
</template>

<style scoped></style>
