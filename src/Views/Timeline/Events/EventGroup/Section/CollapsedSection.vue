<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { useEventColor } from "../../composables/useEventColor";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import type { Node } from "@markwhen/parser/lib/Node";

const props = defineProps<{ node: Node }>();

const hovering = ref(false);
const titleHtml = computed(() => toInnerHtml(props.node.title || ""));

const { color } = useEventColor(props.node);
const hasDefinedColor = computed(() => !!color.value);
</script>

<template>
  <div
    class="dark:border-gray-600 eventTitle transition bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-30 hover:dark:bg-opacity-40 cursor-pointer z-10"
    :class="{
      'bg-gray-400 dark:bg-gray-800 border border-1 dark:border-gray-900/25 v-gray-400/25':
        !hasDefinedColor,
    }"
    :style="
      hasDefinedColor
        ? {
            backgroundColor: `rgba(${color}, ${hovering ? '0.2' : '0.1'})`,
            border: `1px solid rgba(${color}, 0.16)`,
          }
        : {}
    "
    @click="$emit('expand')"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="flex">
      <div class="sticky left-4 px-1 mt-px">
        <span class="" v-if="titleHtml" v-html="titleHtml"></span>
        ({{ (node.value as Array<Node>).length }})
      </div>
    </div>
  </div>
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
