<script setup lang="ts">
import ResizeBar from "@/Panels/ResizeBar.vue";
import { usePanelResize } from "@/Sidebar/composables/usePanelResize";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import type { Path } from "@markwhen/parser/lib/Types";
import { ref, computed, watch } from "vue";
import { useNodeStore, nodeKey } from "./useNodeStore";
import SectionNodeRow from "./Events/SectionNodeRow.vue";

const props = defineProps<{ scrollTop: number }>();
const emits = defineEmits<{ (event: "scroll", top: number): void }>();

const nodeStore = useNodeStore();

const sidebar = ref();
const width = ref(150);

const { tempWidth, resizeMouseDown } = usePanelResize(
  true,
  computed(() => width.value),
  (w) => {
    width.value = w;
  }
);

const rowProps = (path: Path, node: SomeNode) => ({
  node,
  path: path.join(","),
  numChildren: nodeStore.childrenMap.get(path.join(",")),
  numAbove: nodeStore.predecessorMap.get(path.join(",")) || 0,
});

const height = computed(() => {
  const nodeArray = nodeStore.nodeArray;
  if (nodeArray.length) {
    return `${nodeArray.length * 30 + 500}px`;
  } else {
    return "100%";
  }
});

watch(
  () => props.scrollTop,
  (top) => {
    sidebar.value && (sidebar.value.scrollTop = top);
  },
);

const scroll = () => {
  emits("scroll", sidebar.value.scrollTop!);
};
</script>

<template>
  <div
    class="left bg-slate-50 dark:bg-slate-700 z-50 flex flex-row flex-shrink-0 relative h-full noScrollBar"
    :style="{
      width: `${tempWidth ? tempWidth : width}px`,
      overflowX: 'hidden',
      overflowY: 'scroll',
    }"
    ref="sidebar"
    v-on:scroll.passive="scroll"
  >
    <div class="w-full" :style="{ height }">
      <SectionNodeRow
        v-for="{ path, node } of nodeStore.visibleNodes[1]"
        :key="path + nodeKey(node)!"
        v-bind="rowProps(path, node)"
        groupStyle="section"
        :showTitle="true"
      ></SectionNodeRow>
    </div>
    <ResizeBar
      :isLeft="true"
      :resizeMouseDown="resizeMouseDown"
      class="sticky right-0 top-0 bottom-0"
    />
  </div>
</template>

<style scoped></style>
