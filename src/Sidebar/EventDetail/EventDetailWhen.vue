<script setup lang="ts">
import { eventHumanDuration } from "@/Views/Timeline/utilities/dateTimeUtilities";
import { computed } from "vue";
import { useEventDetailStore } from "./eventDetailStore";
import DurationAdjuster from "./DatePicker/DurationAdjuster.vue";

const eventDetailStore = useEventDetailStore();

const ev = computed(() => eventDetailStore.detailEvent);
</script>

<template>
  <div class="pb-3">
    <h3 class="uppercase font-bold text-xs dark:text-gray-500 text-gray-400 px-3">WHEN</h3>
    <div class="px-3 font-bold">{{ ev?.getDateHtml() }}</div>
    <div class="px-3 font-bold">{{ ev && eventHumanDuration(ev) }}</div>
    <!-- <DurationAdjuster /> -->
  </div>
</template>

<style scoped></style>
