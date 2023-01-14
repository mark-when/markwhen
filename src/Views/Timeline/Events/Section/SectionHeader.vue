<script setup lang="ts">
import type { Path, GroupStyle } from "@markwhen/parser/lib/Types";
import { computed, ref, watch } from "vue";
import { useTimelineStore } from "../../timelineStore";
import SectionTitleButton from "./SectionTitleButton.vue";

const timelineStore = useTimelineStore();

const props = defineProps<{
  path: string;
  expanded: boolean;
  titleHtml: string;
  color?: string;
  numChildren: number;
  groupStyle: GroupStyle;
  fullWidth: number;
  left: number;
  hovering: boolean;
}>();

const emit = defineEmits<{
  (event: "toggle", e: MouseEvent): void;
  (event: "hover", hovering: boolean): void;
}>();

const events = computed(() => {
  return {
    click: (e: MouseEvent) => emit("toggle", e),
    mouseover: (e: MouseEvent) => emit("hover", true),
    mouseleave: (e: MouseEvent) => emit("hover", false),
  };
});

const isCollapsed = computed(() => timelineStore.isCollapsed(props.path));

// @ts-ignore
let timeout: timeout;
const transitioning = ref(false);
watch(isCollapsed, () => {
  transitioning.value = true;
  if (!isNaN(timeout)) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    transitioning.value = false;
  }, 200);
});

const width = computed(() => timelineStore.pageScaleBy24 * props.fullWidth);

const styleObject = computed(() => {
  const obj = {
    order: -9999,
    top: `${3 + props.path.slice(1).length * 1.2}rem`,
    zIndex: timelineStore.mode === "gantt" ? 3 : 0,
    height: "30px",
  } as any;
  if (props.groupStyle === "group") {
    obj.width = `${width.value}px`;
    obj.marginLeft = `${timelineStore.pageScaleBy24 * props.left}px`;
  }
  return obj;
});

const click = (e: MouseEvent) => emit("toggle", e);

const titleStyle = computed(() => {
  const styleObj = { left: "1rem" } as any;
  if (timelineStore.mode === "gantt") {
    styleObj.width = `calc(${
      timelineStore.ganttSidebarTempWidth
        ? timelineStore.ganttSidebarTempWidth
        : timelineStore.ganttSidebarWidth
    }px - 0.5rem)`;
    styleObj.overflow = "auto";
  }
  return styleObj;
});

const titleClass = computed(() => {
  if (timelineStore.mode === "gantt") {
    if (props.hovering) {
      return "border dark:border-gray-400 border-black";
    } else {
      return "border border-transparent";
    }
  }
  return "";
});

const childStyleObj = computed(() => {
  const obj = {} as any;
  if (transitioning.value) {
    obj.transition = transitioning.value
      ? "margin-left 200ms cubic-bezier(0.4, 0, 0.2, 1)"
      : "";
  }
  if (props.groupStyle === "group" && isCollapsed.value) {
    obj.marginLeft = `calc(${width.value}px + 0.75rem)`;
  } else {
    obj.marginLeft = 0;
  }
  return obj;
});
</script>

<template>
  <div
    class="flex items-center cursor-pointer"
    :style="styleObject"
    v-on="events"
  >
    <div class="sticky flex items-center left-2" :style="childStyleObj">
      <div
        class="h-[30px] flex flex-row items-center"
        :style="titleStyle"
        :class="titleClass"
      >
        <SectionTitleButton
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
  </div>
</template>

<style scoped></style>
