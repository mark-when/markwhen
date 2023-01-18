<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import { toDateRange, type Event } from "@markwhen/parser/lib/Types";
import type { DateTime } from "luxon";
import { computed, nextTick, onMounted, ref, type Ref } from "vue";
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
  showDateText: boolean;
  showEventTitles: boolean;
  rowHeight: number;
  roundedLeft: boolean;
  roundedRight: boolean;
}>();

const { scalelessDistanceBetweenDates: dist } = useTimelineStore();

const { color, eventRange, dateText, titleHtml } = useEventRefs(
  props.node.value
);

const range = computed(() => toDateRange(eventRange.value!));

const leftX = computed(
  () => dist(props.earliestTime, range.value.fromDateTime) * props.scale
);

const width = computed(
  () => dist(range.value.fromDateTime, range.value.toDateTime) * props.scale
);

const bottom = computed(
  () => (props.height / props.totalHeight) * props.totalWidth
);
const top = computed(() => bottom.value + props.totalWidth / props.totalHeight);
const barRightX = computed(() => leftX.value + width.value);
const barBottomY = computed(
  () => top.value - props.heightUnit / ((4 * props.rowHeight) / 3)
);
const barTopY = computed(
  () => bottom.value + props.heightUnit / ((4 * props.rowHeight) / 3)
);

const d = computed(() => {
  const rightLineCap = props.roundedRight ? `A 1 1 0 0 0` : `L`;
  const leftLineCap = props.roundedLeft ? `A 1 1 0 0 0` : "L";
  return `M ${barRightX.value} ${barBottomY.value} ${rightLineCap} ${barRightX.value} ${barTopY.value} L ${leftX.value} ${barTopY.value} ${leftLineCap} ${leftX.value} ${barBottomY.value} Z`;
});

const text = ref<SVGTextElement>();
const getRightmostX = () =>
  barRightX.value + (text.value?.getComputedTextLength() || 0);

const strokeWidth = computed(() => props.heightUnit / 10);

defineExpose({
  getRightmostX,
});
</script>

<template>
  <path
    fill-rule="evenodd"
    :d="d"
    :fill="`rgba(${color || (dark ? '255, 255, 255' : '0, 0, 0')}, 0.8)`"
    :stroke="`rgb(${color || (dark ? '255, 255, 255' : '0, 0, 0')})`"
    :stroke-width="strokeWidth"
  ></path>
  <text :x="barRightX" :y="barBottomY" ref="text"
    ><tspan class="dateText">&nbsp;&nbsp;</tspan
    ><tspan v-if="showDateText" class="dateText"
      >&nbsp;&nbsp;&nbsp;{{ dateText }}</tspan
    ><tspan v-if="showEventTitles" class="eventTitle"
      >&nbsp;&nbsp;&nbsp;{{ titleHtml }}</tspan
    ><tspan>&nbsp;&nbsp;</tspan></text
  >
</template>

<style scoped></style>
