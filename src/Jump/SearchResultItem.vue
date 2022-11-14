<script setup lang="ts">
import { useEventFinder } from "@/Markwhen/composables/useEventFinder";
import { Event, type EventSubGroup } from "@markwhen/parser/lib/Types";
import type lunr from "lunr";
import { computed } from "vue";
import { toInnerHtml } from "@/Views/Timeline/utilities/innerHtml";

const props = defineProps<{
  searchResult: lunr.Index.Result;
  selected?: boolean;
  last: boolean;
}>();

const find = useEventFinder();

const matchedEventOrGroup = computed(() =>
  find(JSON.parse(props.searchResult.ref))
);

const event = computed(
  () => matchedEventOrGroup.value instanceof Event && matchedEventOrGroup.value
);
const group = computed(() => matchedEventOrGroup.value as EventSubGroup);
</script>

<template>
  <button
    class="px-2 font-bold py-1 flex items-start"
    :class="{
      'bg-indigo-600 text-white': selected,
      'rounded-b': last,
    }"
  >
    <div
      class="font-bold"
      v-if="event"
      v-html="toInnerHtml(event.event.eventDescription)"
    ></div>
    <div
      class=""
      v-else-if="group"
      v-html="
        group.title
          ? toInnerHtml(group.title)
          : group.style === 'group'
          ? '(Group)'
          : '(Section)'
      "
    ></div>
  </button>
</template>

<style scoped></style>
