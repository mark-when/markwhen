<script setup lang="ts">
import { usePageStore } from "@/Markwhen/pageStore";
import { computed } from "vue";
import Tag from "../Drawer/ViewSettings/Tags/Tag.vue";

const props = defineProps<{ tags: string[] }>();
const pageStore = usePageStore();

const allTags = computed(() => Object.keys(pageStore.pageTimeline.tags));
const ourTags = computed(() => props.tags);
const notOurTags = computed(() =>
  allTags.value.filter((t) => !ourTags.value.includes(t))
);
const toggle = (tag: string) => {};
</script>

<template>
  <div class="flex flex-col pb-3">
    <div class="flex flex-row px-1 overflow-auto pb-2">
      <div
        class="w-full h-6 px-2 py-1 mt-1 font-bold dark:text-gray-400 text-gray-500"
        v-if="ourTags.length === 0"
      >
        (untagged)
      </div>
      <Tag
        v-for="tag in ourTags"
        :key="tag"
        :tag="tag"
        :selected="true"
        :muted="false"
        @click="toggle(tag)"
      />
    </div>
    <!-- <hr class="dark:border-gray-700 py-1"> -->
    <div class="flex flex-row px-1 overflow-auto noScrollBar" v-if="notOurTags.length">
      <Tag
        v-for="tag in notOurTags"
        :key="tag"
        :tag="tag"
        :selected="false"
        :muted="false"
        @click="toggle(tag)"
      />
    </div>
  </div>
</template>

<style scoped></style>
