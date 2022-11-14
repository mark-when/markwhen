<script setup lang="ts">
import { useTagColor } from "@/Drawer/ViewSettings/Tags/composables/useTagColor";
import type { EventSubGroup, Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const isEvent = (e: Event | EventSubGroup): e is Event => !Array.isArray(e);

const props = defineProps<{ eventOrGroup: Event | EventSubGroup }>();
const tags = computed(() =>
  isEvent(props.eventOrGroup)
    ? props.eventOrGroup.event.tags
    : props.eventOrGroup.tags || []
);
</script>

<template>
  <div class="flex flex-row gap-1">
    <div
      class="text-xs text-gray-400"
      v-if="isEvent(eventOrGroup) && eventOrGroup?.ranges?.date?.originalString"
    >
      {{ eventOrGroup.ranges.date.originalString }}
    </div>
    <div class="flex flex-row gap-[2px] items-center">
      <div
        class="w-3 h-3 rounded border-2 border-white"
        v-for="tag in tags"
        :style="{
          backgroundColor: `rgba(${useTagColor(tag).value}, 1)`,
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
