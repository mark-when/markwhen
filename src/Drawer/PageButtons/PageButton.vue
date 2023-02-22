<script setup lang="ts">
import { inject, ref, computed, watch } from "vue";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { isEditable } from "@/injectionKeys";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";
import { usePageButtonMove } from "./composables/usePageButtonMove";

const { canHover } = useIsTouchscreen();
const { deletePage } = useEditorOrchestratorStore();
const markwhenStore = useMarkwhenStore();
const pageStore = usePageStore();

const props = defineProps<{
  timeline: Timeline;
  pageIndex: number;
  translate: number;
}>();

const emit = defineEmits<{
  (event: "doneMoving"): void;
  (event: "moving", translateX: number): void;
}>();

const shadowed = computed(() => {
  return !!translateX.value;
});
const hovering = ref(false);
const pageTitle = computed(
  () => markwhenStore.timelines[props.pageIndex].header.title || "untitled"
);
const button = ref<HTMLButtonElement>();
const { moveListener, translateX } = usePageButtonMove(button, () =>
  emit("doneMoving")
);
const computedStyle = computed(() => {
  if (translateX.value !== 0) {
    return { transform: `translateX(${translateX.value}px)`, zIndex: 20 };
  }
  const givenTranslation = props.translate;
  if (givenTranslation) {
    return {
      transform: `translateX(${givenTranslation}px)`,
      transition: "transform cubic-bezier(0.4, 0, 0.2, 1) 150ms",
    };
  }
  return {
    transform: `translateX(0px)`,
  };
});

watch(translateX, (val) => emit("moving", val || 0));

const click = () => {
  pageStore.setPageIndex(props.pageIndex);
};

const mouseOver = () => {
  hovering.value = true;
};

const mouseLeave = () => {
  hovering.value = false;
};

const editable = inject(isEditable, false);
const del = () => deletePage(props.pageIndex);

const events = computed(() => {
  if (!editable) {
    return {};
  }

  const e = { mousedown: moveListener, touchdown: moveListener } as any;
  if (canHover.value) {
    e["mouseover"] = mouseOver;
    e["mouseleave"] = mouseLeave;
  }
  return e;
});
</script>

<template>
  <button
    class="h-8 flex items-center justify-center flex-shrink-0 relative py-1 px-2 font-bold"
    :style="computedStyle"
    v-on="events"
    @click="click"
    :class="{
      'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800':
        pageIndex === pageStore.pageIndex,
      'bg-white hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-300':
        pageIndex !== pageStore.pageIndex,
      'w-10': !pageTitle,
      'shadow-lg': shadowed,
    }"
    ref="button"
  >
    <button
      class="absolute right-0 top-0 text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 dark:bg-slate-700 bg-slate-100 z-30 p-px"
      @click.prevent.stop="del"
      v-if="editable && markwhenStore.timelines.length > 1 && hovering"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
    <h3 v-if="pageTitle" class="px-2 text-sm">
      {{ pageTitle }}
    </h3>
  </button>
</template>

<style scoped></style>
