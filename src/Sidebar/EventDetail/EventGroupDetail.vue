<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import { EventDescription } from "@markwhen/parser/lib/Types";

const props = defineProps<{ eventGroup: EventSubGroup }>();
</script>

<template>
  <div class="py-2">
    <div class="flex flex-col pb-3">
      <div
        class="font-bold text-xl px-3"
        v-html="
          eventGroup.title
            ? EventDescription.toInnerHtml(eventGroup.title)
            : eventGroup.style === 'group'
            ? '(Group)'
            : '(Section)'
        "
      ></div>
      <div class="flex flex-row px-3"></div>
    </div>
  </div>
</template>

<style scoped></style>
