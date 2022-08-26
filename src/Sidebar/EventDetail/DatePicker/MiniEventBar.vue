<script setup lang="ts">
import {
  ceilDateTime,
  floorDateTime,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { DateRange, Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{ event: Event }>();

const bounds = computed(
  () =>
    ({
      fromDateTime: floorDateTime(props.event.ranges.date.fromDateTime, "year"),
      toDateTime: ceilDateTime(props.event.ranges.date.toDateTime, "year"),
    } as DateRange)
);
</script>

<template>
<div class=""></div>
</template>

<style scoped></style>
