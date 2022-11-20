<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { Node } from "@markwhen/parser/lib/Node";
import { useEventColor } from "../composables/useEventColor";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import SectionHeader from "./SectionHeader.vue";
const { distanceFromBaselineLeftmostDate, distanceBetweenDates } =
  useTimelineStore();

const props = defineProps<{
  node: Node;
  path: EventPath;
  canHaveSections: boolean;
}>();

const expanded = ref(!!props.node.startExpanded);
const hovering = ref(false);
const canCalculateButton = ref(false);

const toggle = (e: MouseEvent) => {
  console.log("toggle");
  if (e.target instanceof HTMLAnchorElement) {
    return;
  }
  e.preventDefault();
  expanded.value = !expanded.value;
};

const left = computed(() => {
  if (!props.node || !props.node.ranges()) {
    return 10;
  }
  return distanceFromBaselineLeftmostDate(props.node.ranges()!.fromDateTime);
});

onMounted(() => {
  canCalculateButton.value = expanded.value;
});

watch(expanded, (val) => {
  nextTick(() => {
    canCalculateButton.value = val;
  });
});

const { color } = useEventColor(props.node);

const fullWidth = computed(() => {
  if (!props.node || !props.node.range) {
    return 100;
  }
  return distanceBetweenDates(
    props.node.range.fromDateTime,
    props.node.range.toDateTime
  );
});
const titleHtml = computed(() => toInnerHtml(props.node.title || ""));

const hover = (isHovering: boolean) => {
  hovering.value = isHovering;
};

const groupStyle = computed(() =>
  props.canHaveSections && props.node.style === "section" ? "section" : "group"
);
</script>

<template>
  <div class="relative flex flex-col">
    <ExpandedSectionBackground
      :hovering="hovering"
      :color="color"
      :style="groupStyle"
      :node="node"
      :left="left"
      :full-width="fullWidth"
      :is-detail="false"
    />
    <div
      class="sticky top-0 cursor-pointer"
      :style="{
        marginLeft: `${left}px`,
        width: `${fullWidth}px`,
      }"
      @click="toggle"
      @mouseover="hover(true)"
      @mouseleave="hover(false)"
    ></div>
    <div v-show="expanded">
      <slot></slot>
    </div>
    <SectionHeader
      :path="path.path"
      @toggle="toggle"
      @hover="hover"
      :expanded="expanded"
      :titleHtml="titleHtml"
      :color="color"
      :num-children="(node.value as Array<Node>).length"
      :group-style="groupStyle"
      :left="left"
      :full-width="fullWidth"
    ></SectionHeader>
  </div>
</template>

<style scoped></style>
