<script setup lang="ts">
import { toInnerHtml } from "@/Markwhen/utilities/innerHtml";
import type { Node, NodeArray } from "@markwhen/parser/lib/Node";

defineProps<{ eventGroup: Node<NodeArray> }>();
</script>

<template>
  <div class="py-2">
    <div class="flex flex-col pb-3">
      <div
        class="font-bold text-xl px-3"
        v-html="
          eventGroup.title
            ? toInnerHtml(eventGroup.title)
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
