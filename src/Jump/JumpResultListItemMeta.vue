<script setup lang="ts">
import { useTagColor } from "@/Drawer/ViewSettings/Tags/composables/useTagColor";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { isEventNode, eventValue } from "@markwhen/parser/lib/Noder";
import { computed } from "vue";

const props = defineProps<{ node: SomeNode }>();
const tags = computed(() =>
  isEventNode(props.node)
    ? eventValue(props.node).eventDescription.tags
    : props.node.tags || []
);
</script>

<template>
  <div class="flex flex-row gap-1">
    <div
      class="text-xs text-gray-400"
      v-if="isEventNode(node) && eventValue(node).dateText"
    >
      {{ eventValue(node).dateText }}
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
