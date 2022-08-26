<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";
import { computed } from "vue";
import EventDetailTags from "./EventDetailTags.vue";
import EventDetailWhen from "./EventDetailWhen.vue";
import EventDetailMarkdown from "./EventDetailMarkdown.vue";

const eventDetailStore = useEventDetailStore();

const ev = computed(() => eventDetailStore.detailEvent);
</script>

<template>
  <div class="py-2">
    <div class="font-bold text-xl px-3 pb-3" v-html="ev?.getInnerHtml()"></div>
    <EventDetailWhen />
    <EventDetailTags />
    <EventDetailMarkdown />
  </div>
</template>

<style scoped></style>
