<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { equivalentPaths } from "@/EventDetail/eventDetailStore";
import { isEditable } from "@/injectionKeys";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { computed } from "@vue/reactivity";
import { inject } from "vue";
import { useEventColor } from "../composables/useEventColor";

const props = defineProps<{
  hovering: boolean;
  style: "group" | "section";
  isDetail: boolean;
  node: SomeNode;
  left: number;
  fullWidth: number;
  path: EventPath
}>();
const { color } = useEventColor(props.node);

const isGroupStyle = computed(() => props.style === "group");

const styleObject = computed(() => {
  const obj = {} as any;
  if (color.value) {
    obj.backgroundColor = `rgba(${color.value}, ${
      props.hovering ? "0.09" : "0.05"
    }`;
    obj.border = `1px solid rgba(${color.value}, ${
      props.hovering ? "0.75" : "0.12"
    })`;
  }
  if (isGroupStyle.value) {
    obj.marginLeft = `${props.left - 8}px`;
    obj.width = `max(64px, ${props.fullWidth + 16}px)`;
  }
  return obj;
});
</script>

<template>
  <div
    class="absolute h-full flex flex-row items-center dark:text-gray-400 transition"
    :class="{
      'dark:bg-opacity-30 bg-opacity-20': hovering,
      'dark:bg-opacity-20 bg-opacity-10': !hovering,
      'bg-gray-400 dark:bg-gray-800 border border-1 dark:border-gray-900/25 border-gray-400/25':
        !color,
      'ml-0 w-full': !isGroupStyle,
      'rounded-[12px]': isGroupStyle,
    }"
    :style="styleObject"
  ></div>
</template>

<style scoped></style>
