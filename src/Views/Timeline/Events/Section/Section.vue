<script setup lang="ts">
import { computed, ref } from "vue";
import type { NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { useEventColor } from "../composables/useEventColor";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import SectionHeader from "./SectionHeader.vue";
import NodeRow from "../NodeRow.vue";
import { useTimelineStore } from "../../timelineStore";
import { iterate, ranges } from "@markwhen/parser/lib/Noder";

const props = defineProps<{
  node: SomeNode;
  path: string;
  numChildren?: number | undefined;
  numAbove: number;
}>();

const timelineStore = useTimelineStore();
const {
  scalelessDistanceBetweenDates,
  scalelessDistanceFromBaselineLeftmostDate,
} = timelineStore;

const expanded = ref(!!props.node.startExpanded);
const hovering = ref(false);

const toggle = (e: MouseEvent) => {
  if (e.target instanceof HTMLAnchorElement) {
    return;
  }
  e.preventDefault();
  expanded.value = !expanded.value;
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
  props.node.style === "section" ? "section" : "group"
);

// const marginLeft = computed(
//   () => `${timelineStore.pageScaleBy24 * left.value}px`
// );
const width = computed(
  () => `${timelineStore.pageScaleBy24 * fullWidth.value}px`
);

const top = computed(() => 100 + props.numAbove * 30);

const height = computed(() => 30 + props.numChildren! * 30);

const styleObject = computed(() => ({
  top: `${top.value}px`,
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
        :hovering="hovering"
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
        :path="path"
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
  </div>
</template>

<style scoped></style>
