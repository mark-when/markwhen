<script setup lang="ts">
import { eventHumanDuration } from "@/Views/Timeline/utilities/dateTimeUtilities";
import { computed } from "vue";
import { useEventDetailStore } from "./eventDetailStore";

const eventDetailStore = useEventDetailStore();

const ev = computed(() => {
  console.log("computed detail event from when")
  return eventDetailStore.detailEvent;
});
</script>

<template>
  <div class="pb-3">
    <div class="px-3 font-bold">{{ ev?.getDateHtml() }}</div>
    <div
      class="uppercase font-bold text-xs dark:text-gray-400 text-gray-500 px-3 pt-1"
    >
      {{ ev && eventHumanDuration(ev) }}
    </div>
    <!-- <DurationAdjuster /> -->
  </div>
</template>

<style scoped></style>
