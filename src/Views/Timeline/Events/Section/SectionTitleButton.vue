<script setup lang="ts">
import type { GroupStyle, Path } from "@markwhen/parser/lib/Types";
import { computed, ref } from "vue";
import UpCaret from "./UpCaret.vue";
const props = defineProps<{
  color?: string;
  titleHtml: string;
  expanded: boolean;
  numChildren: number;
  groupStyle: GroupStyle;
  canCalculateButton: boolean;
  path: Path;
}>();

const button = ref();

const buttonWidth = computed(() => {
  // This needs to be here because we want
  // buttonWidth to be recalculated when the title changes
  const title = props.titleHtml;
  if (props.canCalculateButton) {
    return button.value?.clientWidth;
  }
  return 0;
});

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
  (event: "hovering", isHovering: boolean): void;
}>();
const isGroupStyle = computed(() => props.groupStyle === "group");

const styleObject = computed(() => {
  const obj = {
    backgroundColor: `rgba(${props.color}, 0.5)`,
  } as any;
  if (isGroupStyle.value) {
    obj.left = `calc(50% - ${buttonWidth.value! / 2}px)`;
  }
  return obj;
});

const click = (e: MouseEvent) => emit("click", e);
</script>

<template>
  <button
    ref="button"
    class="flex flex-row items-center mt-px dark:bg-opacity-60 bg-opacity-50"
    :class="{
      'bg-gray-500 dark:bg-gray-900': !color,
      'rounded-full px-2 py-px': groupStyle === 'group',
      'px-1': groupStyle !== 'group',
    }"
    :style="styleObject"
    @mouseover="emit('hovering', true)"
    @mouseleave="emit('hovering', false)"
  >
    <svg
      v-for="i in path.slice(1)"
      xmlns="http://www.w3.org/2000/svg"
      class="w-1 h-1 mr-[2px]"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
    </svg>
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
