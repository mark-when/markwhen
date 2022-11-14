<script setup lang="ts">
import type { DateRange, Timelines } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{ markwhen: Timelines; range: DateRange }>();
const displayRange = computed(() => {
  if (props.range.fromDateTime.year === props.range.toDateTime.year) {
    return [props.range.fromDateTime.year];
  } else {
    return [props.range.fromDateTime.year, props.range.toDateTime.year];
  }
});
</script>

<template>
  <tr class="">
    <th></th>
    <th v-if="displayRange.length === 1">{{ displayRange[0] }}</th>
    <th v-else class="flex text-gray-400 font-medium">
      <span>{{ displayRange[0] }}</span
      ><span class="ml-auto">{{ displayRange[1] }}</span>
    </th>
  </tr>
</template>

<style scoped></style>
