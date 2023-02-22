<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { isEditable } from "@/injectionKeys";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { inject, reactive, ref, watch } from "vue";
import PageButton from "./PageButton.vue";

const editable = inject(isEditable);

const markwhenStore = useMarkwhenStore();
const { addPage, movePages } = useEditorOrchestratorStore();

const moveFrom = ref(undefined as number | undefined);
const moveTo = ref(undefined as number | undefined);
const translations = reactive({} as { [index: number]: number });

const buttons = ref<typeof PageButton[]>([]);

const doneMoving = () => {
  if (isNaN(moveFrom.value as number) || isNaN(moveTo.value as number)) {
    return;
  }

  movePages(moveFrom.value!, moveTo.value!);

  moveFrom.value = undefined;
  moveTo.value = undefined;
};

const moving = (pageIndex: number, translationAmount: number) => {
  moveFrom.value = pageIndex;
  const positions = buttons.value.map((button) => {
    const b = button.$el;
    const offsetLeft = b.offsetLeft - b.parentElement.offsetLeft;
    const from = offsetLeft;
    const to = offsetLeft + b.clientWidth;
    return {
      from,
      to,
      midpoint: (to + from) / 2,
    };
  });
  const movingButton = positions[pageIndex];
  const newRightEdge = movingButton.to + translationAmount;
  const newLeftEdge = movingButton.from + translationAmount;

  let leftOf = positions.length - 1;
  let rightOf = 0;
  for (let i = 0; i < positions.length; i++) {
    const buttonPosition = positions[i];
    if (newRightEdge > buttonPosition.midpoint) {
      rightOf = Math.max(i, rightOf);
    }
    if (newLeftEdge < buttonPosition.midpoint) {
      leftOf = Math.min(leftOf, i);
    }
  }
  const newIndex = translationAmount < 0 ? leftOf : rightOf;

  moveTo.value = newIndex;

  // We only need to change elements that are between `newIndex` and `timelineIndex`
  const rangeStart = Math.min(newIndex, pageIndex);
  const rangeEnd = Math.max(newIndex, pageIndex);
  const padding = 8;
  for (let i = 0; i < positions.length; i++) {
    if (i >= rangeStart && i <= rangeEnd) {
      if (i === pageIndex) {
        continue;
      }
      if (i > pageIndex) {
        translations[i] = -(movingButton.to - movingButton.from + padding);
      } else {
        translations[i] = movingButton.to - movingButton.from + padding;
      }
    } else {
      translations[i] = 0;
    }
  }
};
</script>

<template>
  <div
    id="pageButtons"
    class="flex flex-row overflow-x-scroll noScrollBar flex-grow pageButtons"
    style="--webkit-overflow-scrolling: touch; scrollbar-width: none"
  >
    <PageButton
      v-for="(timeline, index) in markwhenStore.timelines"
      :key="index"
      :pageIndex="index"
      :timeline="timeline"
      :translate="translations[index] || 0"
      @moving="moving(index, $event)"
      @doneMoving="doneMoving"
      ref="buttons"
    />
    <button
      v-if="editable"
      title="Add new page"
      class="w-8 h-8 flex items-center justify-center transition bg-white hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-slate-800 dark:border-slate-600 flex-shrink-0 print-hidden"
      @click="addPage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div class="flex-grow bg-white dark:bg-slate-700"></div>
  </div>
</template>

<style scoped></style>
