<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import type { NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { useEventColor } from "../composables/useEventColor";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import SectionHeader from "./SectionHeader.vue";
import { useTimelineStore } from "../../timelineStore";
import { ranges } from "@/utilities/ranges";
import { equivalentPaths } from "@/EventDetail/eventDetailStore";

const editorOrchestrator = useEditorOrchestratorStore();
const props = defineProps<{
  node: SomeNode;
  path: string;
  numChildren?: number | undefined;
  numAbove: number;
  showTitle: boolean;
  groupStyle: "group" | "section" | undefined;
}>();

const timelineStore = useTimelineStore();
const {
  scalelessDistanceBetweenDates,
  scalelessDistanceFromBaselineLeftmostDate,
} = timelineStore;

const collapsed = computed({
  get: () => timelineStore.isCollapsed(props.path),
  set: (val) => timelineStore.setCollapsed(props.path, val),
});
const hovering = ref(false);
const hoveringPath = computed(() => editorOrchestrator.hoveringEventPaths);
const ourPath = computed(() => ({
  type: "pageFiltered",
  path: props.path.split(",").map((i) => parseInt(i)),
}));
const toggle = (e: MouseEvent) => {
  if (e.target instanceof HTMLAnchorElement) {
    return;
  }
  e.preventDefault();
  collapsed.value = !collapsed.value;
};

const sectionRange = computed(() => ranges(props.node));

const left = computed(() => {
  if (!props.node || !sectionRange.value) {
    return 10;
  }
  return scalelessDistanceFromBaselineLeftmostDate(
    sectionRange.value.fromDateTime
  );
});

const { color } = useEventColor(props.node);

const fullWidth = computed(() => {
  // console.log('calling fullwidth')
  if (!props.node || !sectionRange.value) {
    return 100;
  }
  return scalelessDistanceBetweenDates(
    sectionRange.value.fromDateTime,
    sectionRange.value.toDateTime
  );
});
const titleHtml = computed(() => toInnerHtml(props.node.title || ""));

const hover = (isHovering: boolean) => {
  hovering.value = isHovering;
};

const groupStyle = computed(() =>
  props.groupStyle
    ? props.groupStyle
    : timelineStore.mode === "gantt"
    ? "section"
    : props.node.style === "section"
    ? "section"
    : "group"
);

const width = computed(
  () => `${timelineStore.pageScaleBy24 * fullWidth.value}px`
);

const top = computed(() => 100 + props.numAbove * 30);

const height = computed(() => 30 + props.numChildren! * 30);

const styleObject = computed(() => ({
  top: `${top.value}px`,
  display: timelineStore.isCollapsedChild(props.path) ? "none" : "block",
  ...(groupStyle.value === "section"
    ? {
        left: 0,
        right: 0,
      }
    : {}),
}));
</script>

<template>
  <div class="absolute" :style="styleObject">
    <div class="relative flex flex-col">
      <ExpandedSectionBackground
        :hovering="
          hovering || equivalentPaths(hoveringPath?.pageFiltered, ourPath)
        "
        :style="groupStyle"
        :node="node"
        :left="left"
        :height="height"
        :full-width="fullWidth"
        :path="path"
      />
      <div
        class="sticky top-0 cursor-pointer"
        :style="{
          width,
        }"
      ></div>
      <SectionHeader
        :show-title="showTitle"
        :path="path"
        @toggle="toggle"
        @hover="hover"
        :expanded="!collapsed"
        :titleHtml="titleHtml"
        :color="color"
        :num-children="(node.value as NodeArray).length"
        :group-style="groupStyle"
        :left="left"
        :full-width="fullWidth"
      ></SectionHeader>
    </div>
  </div>
</template>

<style scoped></style>
