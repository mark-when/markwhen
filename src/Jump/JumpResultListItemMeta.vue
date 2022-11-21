<script setup lang="ts">
import { useTagColor } from "@/Drawer/ViewSettings/Tags/composables/useTagColor";
import type { Node, NodeArray, NodeValue } from "@markwhen/parser/lib/Node";
import type { Event } from "@markwhen/parser/lib/Types";
import { computed } from "vue";

const props = defineProps<{ node: SomeNode }>();
const tags = computed(() =>
  props.node.isEventNode()
    ? props.node.eventValue().event.tags
    : props.node.tags || []
);
</script>

<template>
  <div class="flex flex-row gap-1">
    <div
      class="text-xs text-gray-400"
      v-if="
        node.isEventNode() && node.eventValue().ranges?.date?.originalString
      "
    >
      {{ node.eventValue().ranges.date.originalString }}
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
