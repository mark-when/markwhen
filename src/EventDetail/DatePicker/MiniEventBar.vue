<script setup lang="ts">
import {
  ceilDateTime,
  floorDateTime,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import { toDateRange, type DateRange, type Event } from "@markwhen/parser/lib/Types";
import type { DateTime } from "luxon";
import { computed } from "vue";

const props = defineProps<{ event: Event }>();

const dr = (from: DateTime, to: DateTime): DateRange => ({
  fromDateTime: from,
  toDateTime: to,
});

const bounds = computed(() => {
  const { fromDateTime, toDateTime } = toDateRange(props.event.dateRangeIso);
  if (toDateTime.year - fromDateTime.year > 5) {
    return dr(
      floorDateTime(fromDateTime.minus({ years: 5 }), "year"),
      ceilDateTime(toDateTime.plus({ years: 5 }), "year")
    );
  }
  if (
    toDateTime.year !== fromDateTime.year ||
    toDateTime.month !== fromDateTime.month
  ) {
    return dr(
      floorDateTime(fromDateTime.minus({ years: 1 }), "year"),
      ceilDateTime(toDateTime.plus({ years: 1 }), "year")
    );
  }
  // Month and year are the same
  if (toDateTime.day !== fromDateTime.day) {
    return dr(
      floorDateTime(fromDateTime.minus({ month: 1 }), "month"),
      ceilDateTime(toDateTime.plus({ month: 1 }), "month")
    );
  }
  // Day is the same
  if (toDateTime.minute !== fromDateTime.minute) {
    return dr(
      floorDateTime(fromDateTime.minus({ days: 1 }), "day"),
      ceilDateTime(toDateTime.plus({ days: 1 }), "day")
    );
  }
  return dr(
    floorDateTime(fromDateTime.minus({ hours: 3 }), "hour"),
    ceilDateTime(toDateTime.plus({ hours: 3 }), "hour")
  );
});
</script>

<template>
  <div class="">
    {{ bounds?.fromDateTime.toISODate() }} {{ bounds?.toDateTime.toISODate() }}
  </div>
</template>

<style scoped></style>
