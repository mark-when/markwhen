<script setup lang="ts">
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import type { EventPath } from "@/Markwhen/composables/useEventFinder";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { Path } from "@markwhen/parser/lib/Types";
import { computed } from "@vue/reactivity";
import { useEventColor } from "../composables/useEventColor";

const props = defineProps<{
  hovering: boolean;
  style: "group" | "section";
  isDetail: boolean;
  node: SomeNode;
  left: number;
  fullWidth: number;
  path: string;
}>();
const { color } = useEventColor(props.node);
const eventDetailStore = useEventDetailStore();

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
  const obj = {} as any;
  if (color.value) {
    if (props.hovering) {
      obj.backgroundColor = `rgba(${color.value}, 0.1`;
    } else if (!isDeep.value) {
      obj.backgroundColor = `rgba(${color.value}, 0.05)`;
    }
    obj.border = `1px solid rgba(${color.value}, ${
      isDetailEvent.value ? "0.95" : props.hovering ? "0.75" : "0.12"
    })`;
  }
  if (isGroupStyle.value) {
    obj.marginLeft = `calc(calc(var(--timeline-scale-by-24) * ${props.left}px) - 8px)`;
    obj.width = `max(64px, calc(calc(var(--timeline-scale-by-24) * ${props.fullWidth}px) + 16px))`;
  }
  return obj;
});
</script>

<template>
  <div
    class="absolute h-full flex flex-row items-center dark:text-gray-400 transition"
    :class="{
      'dark:bg-opacity-30 bg-opacity-20': hovering,
      'dark:bg-opacity-20 bg-opacity-10': !hovering && !isDeep,
      border: !color,
      'dark:border-gray-900/25 border-gray-400/25': !color && isDeep,
      'bg-gray-400 dark:bg-gray-800 dark:border-gray-900/25 border-gray-400/25':
        (!color && !isDeep) || (!color && hovering),
      'ml-0 w-full': !isGroupStyle,
      'rounded-[12px]': isGroupStyle,
    }"
    :style="styleObject"
  ></div>
</template>

<style scoped></style>
