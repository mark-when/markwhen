<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { computed } from "vue";
import { useEventDetailStore } from "./eventDetailStore";
import Tag from "../../Drawer/ViewSettings/Tags/Tag.vue";

const eventDetailStore = useEventDetailStore();
const pageStore = usePageStore();

const allTags = computed(() => Object.keys(pageStore.pageTimeline.tags));
const ourTags = computed(() => eventDetailStore.detailEvent?.event.tags || []);
const notOurTags = computed(() =>
  allTags.value.filter((t) => !ourTags.value.includes(t))
);
const toggle = (tag: string) => {};
</script>

<template>
  <div class="flex flex-col pb-3">
    <h3
      class="uppercase font-bold text-xs dark:text-gray-500 text-gray-400 px-3"
    >
      TAGS
    </h3>
    <div class="flex flex-row p-1 overflow-auto">
      <div
        class="w-full h-6 px-2 font-bold dark:text-gray-400 text-gray-500"
        v-if="ourTags.length === 0"
      >
        (untagged)
      </div>
      <Tag
        v-for="tag in ourTags"
        :key="tag"
        :tag="tag"
        :selected="true"
        :muted="true"
        @click="toggle(tag)"
      />
    </div>
    <div
      class="flex flex-row dark:bg-gray-700 bg-gray-200 p-1 rounded overflow-auto"
      v-if="notOurTags.length"
    >
      <Tag
        v-for="tag in notOurTags"
        :key="tag"
        :tag="tag"
        :selected="false"
        :muted="true"
        @click="toggle(tag)"
      />
    </div>
  </div>
</template>

<style scoped></style>
