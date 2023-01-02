<script setup lang="ts">
import type { SomeNode } from "@markwhen/parser/lib/Node";
import Section from "./Section/Section.vue";

const props = defineProps<{
  node: SomeNode;
  path: string;
  numAbove: number;
  numChildren?: number | undefined;
  showTitle: boolean;
  groupStyle: "group" | "section" | undefined
}>();
</script>

<template>
  <Section
    :node="node"
    :path="path"
    :numChildren="numChildren"
    :numAbove="numAbove"
    :showTitle="showTitle"
    :groupStyle="groupStyle"
  >
  </Section>
</template>

<style scoped></style>
