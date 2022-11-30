<script setup lang="ts">
import type { Path, GroupStyle } from "@markwhen/parser/lib/Types";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import SectionTitleButton from "./SectionTitleButton.vue";

const props = defineProps<{
  path: Path;
  expanded: boolean;
  titleHtml: string;
  color?: string;
  numChildren: number;
  groupStyle: GroupStyle;
  fullWidth: number;
  left: number;
}>();

const emit = defineEmits<{
  (event: "toggle", e: MouseEvent): void;
  (event: "hover", hovering: boolean): void;
}>();

const canCalculateButton = ref(false);

onMounted(() => {
  canCalculateButton.value = props.expanded;
});

watch(
  () => props.expanded,
  (expanded) => {
    nextTick(() => {
      canCalculateButton.value = expanded;
    });
  }
);

const events = computed(() => {
  return {
    click: (e: MouseEvent) => emit("toggle", e),
    mouseover: (e: MouseEvent) => emit("hover", true),
    mouseleave: (e: MouseEvent) => emit("hover", false),
  };
});

const styleObject = computed(() => {
  const obj = {
    order: -9999,
    top: `${3 + props.path.slice(1).length * 1.2}rem`,
    zIndex: 0,
  } as any;
  if (props.groupStyle === "group") {
    (obj.width = `${props.fullWidth}px`), (obj.marginLeft = `${props.left}px`);
  }
  return obj;
});

const click = (e: MouseEvent) => emit("toggle", e);
</script>

<template>
  <div
    class="flex items-center cursor-pointer"
    :style="styleObject"
    v-on="events"
  >
    <div class="sticky flex items-center" :style="{ left: `1rem` }">
      <SectionTitleButton
        :can-calculate-button="canCalculateButton"
        :title-html="titleHtml"
        :color="color"
        :num-children="numChildren"
        :expanded="expanded"
        :group-style="groupStyle"
        :path="path"
        @click="click"
      ></SectionTitleButton>
    </div>
  </div>
</template>

<style scoped></style>
