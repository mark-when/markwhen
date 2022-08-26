<script setup lang="ts">
import type { DateTime } from "luxon";

const props = withDefaults(
  defineProps<{
    dateTime: DateTime;
    yearShowing: boolean;
    monthShowing: boolean;
    dayShowing: boolean;
    timeShowing: boolean;
  }>(),
  {
    yearShowing: true,
    monthShowing: true,
    dayShowing: true,
    timeShowing: true,
  }
);
</script>

<template>
  <div class="px-3">
    <div class="font-bold" style="font-family: system-ui">
      <div class="">
        {{ dateTime.year }}
      </div>
      <div class="">{{ dateTime.monthShort }}</div>
    </div>
  </div>
</template>

<style scoped></style>
