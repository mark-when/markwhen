<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import Dialog from "@/Dialog/Dialog.vue";
import JumpResultList from "./JumpResultList.vue";
import { isParseResult, useJumpStore, type ParseResult } from "./jumpStore";
import type lunr from "lunr";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import type { EventPaths } from "@/Views/ViewOrchestrator/useStateSerializer";
import { useVisualizationStore } from "@/Views/visualizationStore";

const input = ref();
const visualizationStore = useVisualizationStore();
const jumpStore = useJumpStore();

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (event: "update:modelValue", open: boolean): void;
}>();

const rangeInput = ref<string>();
const jumpResult = computed(() => jumpStore.jumpResult);
const dialogShowing = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

watch(dialogShowing, (showing) => {
  if (showing) {
    setTimeout(() => reset(), 10);
    nextTick(() => {
      input.value?.focus();
    });
  } else {
    input.value?.blur();
  }
});
const reset = () => {
  rangeInput.value = undefined;
};

const eventDetailStore = useEventDetailStore();
const openDetail = computed({
  get() {
    return eventDetailStore.shouldOpenDetailWhenJumping;
  },
  set(val) {
    eventDetailStore.setShouldOpenDetailWhenJumping(val);
  },
});

const up = (e: KeyboardEvent) => {
  if (!jumpResult.value || !jumpResult.value?.length) {
    return;
  }
  e.preventDefault();
  jumpStore.selectPrevIndex();
};

const down = (e: KeyboardEvent) => {
  if (!jumpResult.value || !jumpResult.value?.length) {
    return;
  }
  e.preventDefault();
  jumpStore.selectNextIndex();
};

const esc = (e: KeyboardEvent) => {
  if (rangeInput.value) {
    rangeInput.value = "";
    e.preventDefault();
    e.stopPropagation();
  }
};

watch(rangeInput, (input) => {
  jumpStore.search(input);
});

const selectedResult = (item: ParseResult | lunr.Index.Result) => {
  if (isParseResult(item)) {
    visualizationStore.jumpToRange(item.dateRange);
  } else {
    const paths: EventPaths = JSON.parse(item.ref);
    paths.pageFiltered?.path &&
      visualizationStore.jumpToPath({
        type: "pageFiltered",
        path: paths.pageFiltered.path,
      });
    if (eventDetailStore.shouldOpenDetailWhenJumping) {
      eventDetailStore.setDetailEventPath(paths.page!);
    }
  }
  dialogShowing.value = false;
};

const submit = () => {
  if (jumpStore.jumpResult) {
    const selected = jumpStore.jumpResult[jumpStore.selectedIndex];
    jumpStore.search();
    selectedResult(selected);
  }
};
</script>

<template>
  <Dialog v-model="dialogShowing" overflow="visible">
    <template #header>
      <div
        class="p-2 flex flex-row items-center dark:text-white text-gray-800 font-bold"
      >
        Jump to date or range or event
      </div></template
    >
    <form class="w-full flex px-2 pb-2 flex-col" @submit.prevent="submit">
      <div class="w-full relative">
        <input
          ref="input"
          type="text"
          placeholder="now, Oct 2022, 01-1998/2003"
          v-model="rangeInput"
          class="w-full py-1 px-2 outline-none rounded-t dark:bg-gray-700 font-bold dark:text-white bg-gray-100"
          :class="{
            'rounded-b': !jumpResult || !jumpResult.length,
          }"
          required
          @keydown.up="up"
          @keydown.down="down"
          @keydown.esc="esc"
        />
        <JumpResultList
          v-if="jumpResult"
          :jump-result="jumpResult"
          @click="selectedResult"
        />
      </div>
      <div
        class="flex flex-row justify-end text-sm font-bold text-gray-500 dark:text-gray-400 pt-1"
      >
        <!-- <div class="flex flex-row items-center mr-2">
          <input
            type="checkbox"
            id="zoom"
            class="mr-1"
            v-model="scrollAndZoom"
          />
          <label for="zoom"><div>Zoom</div></label>
        </div> -->
        <div class="flex flex-row items-center">
          <input
            type="checkbox"
            id="openDetail"
            class="mr-1"
            v-model="openDetail"
          />
          <label for="openDetail"><div>Open event details</div></label>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<style scoped></style>
