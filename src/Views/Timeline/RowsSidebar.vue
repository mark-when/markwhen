<script setup lang="ts">
import ResizeBar from "@/Panels/ResizeBar.vue";
import { usePanelResize } from "@/Sidebar/composables/usePanelResize";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import type { Path } from "@markwhen/parser/lib/Types";
import { ref, computed } from "vue";
import { useNodeStore, nodeKey } from "./useNodeStore";
import SectionNodeRow from "./Events/SectionNodeRow.vue";

const nodeStore = useNodeStore();

const width = ref(150);

const { tempWidth, resizeMouseDown } = usePanelResize(
  true,
  computed(() => width.value),
  (w) => {
    width.value = w;
  }
);

const props = (path: Path, node: SomeNode) => ({
  node,
  path: path.join(","),
  numChildren: nodeStore.childrenMap.get(path.join(",")),
  numAbove: nodeStore.predecessorMap.get(path.join(",")) || 0,
});
</script>

<template>
  <div
    class="left bg-slate-50 dark:bg-slate-700 h-full z-50 flex flex-row flex-shrink-0 relative"
    :style="{
      width: `${tempWidth ? tempWidth : width}px`,
    }"
  >
    <div class="w-full">
      <template
        v-for="{ path, node } of nodeStore.visibleNodes[1]"
        :key="path + nodeKey(node)"
      >
        <SectionNodeRow
          v-bind="props(path, node)"
          :showTitle="true"
        ></SectionNodeRow>
      </template>
    </div>
    <ResizeBar
      :isLeft="true"
      :resizeMouseDown="resizeMouseDown"
      class="absolute"
    />
  </div>
</template>

<style scoped></style>
