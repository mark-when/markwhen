<script setup lang="ts">
import type { Node } from "@markwhen/parser/lib/Node";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  hovering: boolean;
  color?: string;
  style: "group" | "section";
  isDetail: boolean;
  node: Node;
  left: number;
  fullWidth: number;
}>();

const isGroupStyle = computed(() => props.style === "group");

const styleObject = computed(() => {
  const obj = {} as any;
  if (props.color) {
    obj.backgroundColor = `rgba(${props.color}, ${
      props.hovering ? "0.09" : "0.05"
    }`;
    obj.border = `1px solid rgba(${props.color}, ${
      props.hovering ? "0.35" : "0.12"
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
