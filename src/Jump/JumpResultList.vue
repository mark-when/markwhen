<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import { dateRangeToString } from "@/Views/Timeline/utilities/dateTimeUtilities";
import { Event, type DateFormat } from "@markwhen/parser/lib/Types";
import type { Node, NodeArray, NodeValue } from "@markwhen/parser/lib/Node";
import type lunr from "lunr";
import {
  useJumpStore,
  type JumpResults,
  isParseResult,
  type ParseResult,
} from "./jumpStore";
import JumpResultListItem from "./JumpResultListItem.vue";
import {
  useEventFinder,
  type EventFinder,
} from "@/Markwhen/composables/useEventFinder";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";
import JumpResultListItemMeta from "./JumpResultListItemMeta.vue";
import { ref, watch } from "vue";
import type { EventPaths } from "@/Markwhen/eventMapStore";

const props = defineProps<{ jumpResult: JumpResults }>();
const emit = defineEmits<{
  (event: "click", item: ParseResult | lunr.Index.Result): void;
}>();
const jumpStore = useJumpStore();
const markersStore = useMarkersStore();
const pageStore = usePageStore();

const list = ref();

const dateRangeString = (parseResult: ParseResult) =>
  dateRangeToString(
    parseResult.dateRange,
    parseResult.scale || markersStore.scaleOfViewportDateInterval,
    pageStore.pageTimelineMetadata.dateFormat as DateFormat
  );

const eventFinder: EventFinder = useEventFinder();

const matchedEventOrGroup: (
  sr: lunr.Index.Result
) => Node<NodeValue> | undefined = (sr: lunr.Index.Result) =>
  eventFinder(JSON.parse(sr.ref) as EventPaths);

const titleForListItem = (item: ParseResult | lunr.Index.Result) => {
  if (isParseResult(item)) {
    return dateRangeString(item);
  } else {
    const node = matchedEventOrGroup(item);
    if (node?.isEventNode()) {
      return toInnerHtml(node.eventValue().event.eventDescription);
    } else if (!!node) {
      return (
        (node.title
          ? toInnerHtml(node.title)
          : node.style === "group"
          ? "(Group)"
          : "(Section)") + ` (${(node.value as NodeArray).length})`
      );
    } else {
      return "";
    }
  }
};

watch(
  () => jumpStore.selectedIndex,
  (index, prev) => {
    const el = document.getElementById(`listResult_${index}`);
    // @ts-ignore
    el?.scrollIntoViewIfNeeded(false);
  }
);
</script>

<template>
  <div
    ref="list"
    v-if="jumpResult.length"
    class="absolute left-0 right-0 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-b shadow-lg flex flex-col overflow-scroll"
    style="top: 100%; max-height: 700%"
  >
    <JumpResultListItem
      :id="`listResult_${index}`"
      v-for="(searchResult, index) in jumpResult"
      :selected="jumpStore.selectedIndex === index"
      :last="index === jumpResult.length - 1"
      @click="emit('click', searchResult)"
    >
      <div v-html="titleForListItem(searchResult)"></div>
      <template #right v-if="jumpStore.selectedIndex === index">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
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
          <path d="M12 16l4 -4l-4 -4"></path>
          <path d="M8 12h8"></path>
          <path
            d="M4 17.333v-10.666a2.667 2.667 0 0 1 2.667 -2.667h10.666a2.667 2.667 0 0 1 2.667 2.667v10.666a2.667 2.667 0 0 1 -2.667 2.667h-10.666a2.667 2.667 0 0 1 -2.667 -2.667z"
          ></path></svg
      ></template>
      <JumpResultListItemMeta
        #bottom
        v-if="!isParseResult(searchResult)"
        :node="matchedEventOrGroup(searchResult)!"
      ></JumpResultListItemMeta>
    </JumpResultListItem>
  </div>
</template>

<style scoped></style>
