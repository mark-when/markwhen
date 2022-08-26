<script setup lang="ts">
import { eventHumanDuration } from "@/Views/Timeline/utilities/dateTimeUtilities";
import DateAdjuster from "./DatePicker/DateAdjuster.vue";
import { useEventDetailStore } from "./eventDetailStore";

const eventDetailStore = useEventDetailStore();
</script>

<template>
  <div class="">
    {{ eventDetailStore.detailEvent && eventHumanDuration(eventDetailStore.detailEvent) }}
    <DateAdjuster
      v-if="eventDetailStore.detailEvent"
      :date-time="eventDetailStore.detailEvent.ranges.date.fromDateTime"
    />
  </div>
</template>

<style scoped></style>
