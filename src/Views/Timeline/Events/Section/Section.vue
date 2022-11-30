<script setup lang="ts">
import { computed, ref,  } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { Node, NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { useEventColor } from "../composables/useEventColor";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import SectionHeader from "./SectionHeader.vue";
const { scalelessDistanceFromBaselineLeftmostDate, scalelessDistanceBetweenDates } =
  useTimelineStore();

const props = defineProps<{
  node: SomeNode;
  path: EventPath;
  canHaveSections: boolean;
}>();

const expanded = ref(!!props.node.startExpanded);
const hovering = ref(false);

const toggle = (e: MouseEvent) => {
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
  return scalelessDistanceFromBaselineLeftmostDate(props.node.ranges()!.fromDateTime);
});

const { color } = useEventColor(props.node);

const fullWidth = computed(() => {
  if (!props.node || !props.node.ranges()) {
    return 100;
  }
  return scalelessDistanceBetweenDates(
    props.node.ranges()!.fromDateTime,
    props.node.ranges()!.toDateTime
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
      :style="groupStyle"
      :node="node"
      :left="left"
      :full-width="fullWidth"
      :is-detail="false"
      :path="path"
    />
    <div
      class="sticky top-0 cursor-pointer"
      :style="{
        marginLeft: `calc(var(--timelines-scale-by-24) * ${left}px)`,
        width: `calc(var(--timeline-scale-by-24) * ${fullWidth}px)`,
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
      :num-children="(node.value as NodeArray).length"
      :group-style="groupStyle"
      :left="left"
      :full-width="fullWidth"
    ></SectionHeader>
  </div>
</template>

<style scoped></style>
