<script setup lang="ts">
import { useMaps, nodeKey } from "./composables/useMaps";
import EventNodeRow from "./EventNodeRow.vue";
import SectionNodeRow from "./SectionNodeRow.vue";

const { visibleNodes, childrenMap, predecessorMap } = useMaps();
</script>

<template>
  <template v-for="{ path, node } of visibleNodes[1]" :key="nodeKey(node)">
    <SectionNodeRow
      :node="node"
      :path="path.join(',')"
      :numChildren="childrenMap.get(path.join(','))"
      :numAbove="predecessorMap.get(path.join(',')) || 0"
    ></SectionNodeRow>
  </template>
  <template v-for="{ path, node } of visibleNodes[0]" :key="nodeKey(node)">
    <EventNodeRow
      :node="node"
      :path="path.join(',')"
      :numChildren="childrenMap.get(path.join(','))"
      :numAbove="predecessorMap.get(path.join(',')) || 0"
    ></EventNodeRow>
  </template>
</template>
