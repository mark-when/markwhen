<script setup lang="ts">
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { computed } from "@vue/reactivity";
import { useTimelineStore } from "../../timelineStore";
import { useEventColor } from "../composables/useEventColor";

const props = defineProps<{
  hovering: boolean;
  style: "group" | "section";
  node: SomeNode;
  left: number;
  fullWidth: number;
  path: string;
  height: number;
}>();
const { color } = useEventColor(computed(() => props.node));
const eventDetailStore = useEventDetailStore();
const timelineStore = useTimelineStore();

const isGroupStyle = computed(() => props.style === "group");

const computedPath = computed(() =>
  props.path.split(",").map((i) => parseInt(i))
);

const isDetailEvent = computed(() =>
  eventDetailStore.isDetailEventPath({
    type: "pageFiltered",
    path: computedPath.value,
  })
);
const isDeep = computed(() => computedPath.value.length > 4);

const styleObject = computed(() => {
  const obj = {
    height: `${props.height}px`,
    transition: `height 200ms cubic-bezier(0.4, 0, 0.2, 1)`,
  } as any;
  if (color.value) {
    if (props.hovering || isDetailEvent.value) {
      obj.backgroundColor = `rgba(${color.value}, 0.1`;
    } else if (!isDeep.value) {
      obj.backgroundColor = `rgba(${color.value}, 0.05)`;
    }
    const border = `1px solid rgba(${color.value}, ${
      isDetailEvent.value
        ? "0.95"
        : props.hovering
        ? "0.75"
        : "0.12"
    })`;
    obj.borderTop = border;
    obj.borderBottom = border;
    if (isGroupStyle.value) {
      obj.borderLeft = border;
      obj.borderRight = border;
    }
  }
  if (isGroupStyle.value) {
    obj.marginLeft = `${timelineStore.pageScaleBy24 * props.left - 8}px`;
    obj.width = `calc(${timelineStore.pageScaleBy24 * props.fullWidth + 16}px)`;
  }
  return obj;
});
</script>

<template>
  <div
    class="absolute h-full flex flex-row items-center dark:text-gray-400 pointer-events-none"
    :class="{
      'dark:bg-opacity-30 bg-opacity-20': hovering || (!color && isDetailEvent),
      'dark:bg-opacity-20 bg-opacity-10': !hovering && !isDeep,
      'border-t border-b': !color,
      'border-l border-r': isGroupStyle,
      'dark:border-gray-900/25 border-gray-400/25': !color && isDeep,
      'bg-gray-400 dark:bg-gray-600': !color && !isDeep,
      'dark:border-gray-400/25 border-gray-400/25': !color && !hovering,
      'dark:border-gray-400 border-gray-600':
        !color && (hovering || isDetailEvent),
      'ml-0 w-full': !isGroupStyle,
      'rounded-[14px]': isGroupStyle,
    }"
    :style="styleObject"
  ></div>
</template>

<style scoped></style>
