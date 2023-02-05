<script setup lang="ts">
import { humanDuration } from "@/Markwhen/utilities/dateTimeUtilities";
import type { DateRange } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{ dateHtml: string, dateRange: DateRange }>();
const duration = computed(() => humanDuration(props.dateRange))
</script>

<template>
  <div class="pb-3">
    <div class="px-3 font-bold">{{ dateHtml }}</div>
    <div
      class="uppercase font-bold text-xs dark:text-gray-400 text-gray-500 px-3"
    >
      {{ duration }}
    </div>
  </div>
</template>

<style scoped></style>
