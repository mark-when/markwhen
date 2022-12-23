<script setup lang="ts">
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { onMounted } from "vue";
import Section from "./Section/Section.vue";

const props = defineProps<{
  node: SomeNode;
  path: string;
  numAbove: number;
  numChildren?: number | undefined;
}>();

onMounted(() => console.log("mounted"));
</script>

<template>
  <Section
    :node="node"
    :path="path"
    :numChildren="numChildren"
    :numAbove="numAbove"
  >
  </Section>
</template>

<style scoped></style>
