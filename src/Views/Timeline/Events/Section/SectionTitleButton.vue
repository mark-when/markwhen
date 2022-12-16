<script setup lang="ts">
import type { GroupStyle, Path } from "@markwhen/parser/lib/Types";
import { computed, ref } from "vue";
import DepthIndicator from "./DepthIndicator.vue";
import UpCaret from "./UpCaret.vue";
const props = defineProps<{
  color?: string;
  titleHtml: string;
  expanded: boolean;
  numChildren: number;
  groupStyle: GroupStyle;
  path: string;
}>();

const button = ref();

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
  (event: "hovering", isHovering: boolean): void;
}>();

const styleObject = computed(() => {
  const obj = {
    backgroundColor: `rgba(${props.color}, 0.5)`,
  } as any;
  return obj;
});

const click = (e: MouseEvent) => emit("click", e);
</script>

<template>
  <button
    ref="button"
    class="flex flex-row items-center dark:bg-opacity-60 bg-opacity-50"
    :class="{
      'bg-gray-500 dark:bg-gray-900': !color,
      'rounded-full px-2 py-px': groupStyle === 'group',
      'px-1': groupStyle !== 'group',
    }"
    :style="styleObject"
    @mouseover.passive="emit('hovering', true)"
    @mouseleave.passive="emit('hovering', false)"
  >
    <DepthIndicator :depth="path.split(',').length" />
    <div class="flex flex-row flex-grow items-center justify-center">
      <span class="eventTitle" v-if="titleHtml" v-html="titleHtml"> </span>
      <span class="eventTitle ml-1" v-if="!expanded">({{ numChildren }})</span>
    </div>
    <UpCaret v-if="expanded" />
  </button>
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
