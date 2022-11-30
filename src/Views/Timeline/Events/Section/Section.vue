<script setup lang="ts">
import { computed, onRenderTriggered, onUpdated, ref, watch } from "vue";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { Node, NodeArray, SomeNode } from "@markwhen/parser/lib/Node";
import { useEventColor } from "../composables/useEventColor";
import ExpandedSectionBackground from "./ExpandedSectionBackground.vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import SectionHeader from "./SectionHeader.vue";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Block } from "@markwhen/parser/lib/Types";
import NodeRow from "../NodeRow.vue";

const props = defineProps<{
  node: SomeNode;
  path: string;
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
  console.log('calling fullwidth')
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
  props.node.style === "section" ? "section" : "group"
);

const nodeKey = (n: SomeNode) => {
  if (n.isEventNode()) {
    const event = n.eventValue().event;
    return (
      event.eventDescription +
      event.supplemental
        .filter((b) => b.type !== "image")
        .map((b) => (b as Block).raw)
        .join(" ")
    );
  } else {
    return n.title;
  }
};

onRenderTriggered((h) => {
  console.log(props.path, h);
});

watch(props, (p) => {
  console.log(p)
})

onUpdated(() => {
  console.log('section updated')
})
</script>

<template>
  <div class="relative flex flex-col">
    <!-- <ExpandedSectionBackground
      :hovering="hovering"
      :style="groupStyle"
      :node="node"
      :left="left"
      :full-width="fullWidth"
      :is-detail="false"
      :path="path"
    /> -->
    <div
      class="sticky top-0 cursor-pointer"
      :style="{
        marginLeft: `calc(var(--timelines-scale-by-24) * ${left}px)`,
        width: `calc(var(--timeline-scale-by-24) * ${fullWidth}px)`,
      }"
    ></div>
    <div v-show="expanded">
      <NodeRow
        v-for="(node, i) in (props.node.value as NodeArray)"
        :path="[...path.split(','), i].join(',')"
        :node="node"
        :key="[...path.split(','), i].join(',')"
      ></NodeRow>
    </div>
    <!-- <SectionHeader
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
    ></SectionHeader> -->
  </div>
</template>

<style scoped></style>
