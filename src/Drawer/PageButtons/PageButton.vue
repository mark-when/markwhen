<script setup lang="ts">
import { inject, ref, computed, watch } from "vue";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { isEditable } from "@/injectionKeys";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { usePageStore } from "@/Markwhen/pageStore";

const { deletePage } = useEditorOrchestratorStore();
const markwhenStore = useMarkwhenStore();
const pageStore = usePageStore();

const props = defineProps<{
  timeline: Timeline;
  pageIndex: number;
  shadowed: boolean;
  translate: number;
}>();

const emit = defineEmits<{
  (event: "doneMoving"): void;
  (event: "moving", translateX: number): void;
}>();

const hovering = ref(false);
const startX = ref<number | undefined>(undefined);
const translateX = ref(0);
const pageTitle = computed(
  () => markwhenStore.timelines[props.pageIndex].metadata.title
);
const button = ref<HTMLButtonElement>();

const computedStyle = computed(() => {
  if (translateX.value !== 0) {
    return { transform: `translateX(${translateX.value}px)`, zIndex: 20 };
  }
  const givenTranslation = props.translate;
  if (givenTranslation) {
    return { transform: `translateX(${givenTranslation}px)` };
  }
  return { transform: `translateX(0px)` };
});

watch(translateX, (val) => emit("moving", val));

const click = () => {
  pageStore.setPageIndex(props.pageIndex);
};

const mouseOver = () => {
  hovering.value = true;
};

const mouseLeave = () => {
  hovering.value = false;
};

const moveListener = (e: MouseEvent | TouchEvent) => {
  // Since we're moving, cancel any hover timer we had
  if (hovering.value) {
    hovering.value = false;
  }
  if (!button.value) {
    return;
  }

  // We shouldn't go any further than the start of the parent element
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const diff = clientX - startX.value!;
  const parentOffsetLeft = button.value.parentElement?.offsetLeft || 0;
  const addPageButtonWidth = 20;
  const maxRight =
    button.value.parentElement!.scrollWidth -
    button.value.offsetLeft -
    button.value.clientWidth -
    addPageButtonWidth;
  translateX.value = Math.min(
    Math.max(-button.value.offsetLeft + parentOffsetLeft, diff),
    maxRight
  );
};

const stopMoving = () => {
  startX.value = undefined;
  translateX.value = 0;
  document.removeEventListener("mousemove", moveListener);
  document.removeEventListener("touchmove", moveListener);
  document.removeEventListener("mouseup", endMoveListener);
  document.removeEventListener("touchend", endMoveListener);
  document.removeEventListener("keydown", escapeListener);
};

const endMoveListener = (e: MouseEvent | TouchEvent) => {
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  if (Math.abs(clientX - startX.value!) > 2) {
    document.addEventListener("click", captureClick, true);
  }
  emit("doneMoving");
  stopMoving();
};

const captureClick = (e: MouseEvent) => {
  e.stopPropagation();
  document.removeEventListener("click", captureClick, true);
};

const escapeListener = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    stopMoving();
  }
};

const editable = inject<boolean>(isEditable, false);
const startMoving = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  startX.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  document.addEventListener("touchmove", moveListener);
  document.addEventListener("mousemove", moveListener);
  document.addEventListener("touchend", endMoveListener);
  document.addEventListener("mouseup", endMoveListener);
  document.addEventListener("keydown", escapeListener);
};
const del = () => deletePage(props.pageIndex);
</script>

<template>
  <button
    class="h-10 border-2 flex items-center justify-center flex-shrink-0 relative p-1"
    :style="computedStyle"
    v-on="
      editable
        ? {
            mouseover: mouseOver,
            mouseleave: mouseLeave,
            mousedown: startMoving,
            touchdown: startMoving,
          }
        : {}
    "
    @click="click"
    :class="{
      'border-slate-200 border-t-0 bg-slate-50 dark:bg-slate-800 dark:border-slate-500':
        pageIndex === pageStore.pageIndex,
      'border-white border-t-slate-200 dark:border-t-slate-500 border-x-0 border-b-0 bg-white hover:bg-slate-50 border-blue-100 dark:bg-slate-700 dark:hover:bg-slate-800 dark:border-slate-600':
        pageIndex !== pageStore.pageIndex,
      'w-10': !pageTitle,
      'shadow-sm': shadowed,
    }"
    ref="button"
  >
    <button
      class="absolute right-0 top-0 text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 rounded-full dark:bg-slate-700 bg-slate-100 z-30"
      @click.prevent.stop="del"
      v-if="editable && markwhenStore.timelines.length > 1 && hovering"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <h3
      v-if="pageTitle"
      class="px-2 font-bold text-gray-500 dark:text-gray-300"
    >
      {{ pageTitle }}
    </h3>
  </button>
</template>

<style scoped></style>
