<script setup lang="ts">
import { eventHumanDuration } from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { Event } from "@markwhen/parser/lib/Types";

const props = defineProps<{ event: Event }>();
</script>

<template>
  <div class="pb-3">
    <div class="px-3 font-bold">{{ event.getDateHtml() }}</div>
    <div
      class="uppercase font-bold text-xs dark:text-gray-400 text-gray-500 px-3"
    >
      {{ eventHumanDuration(event) }}
    </div>
    <!-- <DurationAdjuster /> -->
  </div>
</template>

<style scoped></style>
