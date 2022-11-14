<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Block, Range } from "@markwhen/parser/lib/Types";
import { toInnerHtml } from "../../utilities/innerHtml";

const props = defineProps<{
  supplemental: Block[];
  matchedListItems: Range[];
}>();

const editorOrchestratorStore = useEditorOrchestratorStore();

const onChange = (index: number, checked: boolean) => {};
</script>

<template>
  <div style="font-family: system-ui">
    <template v-for="(item, index) in supplemental">
      <div
        v-if="item.type === 'checkbox'"
        :key="index"
        class="flex flex-row items-center"
      >
        <input
          type="checkbox"
          :disabled="!editorOrchestratorStore.editable"
          :checked="item.value"
          @change="onChange(index, !item.value)"
          :id="`checkbox_${index}_${item.raw}`"
        />
        <label
          v-html="toInnerHtml(item.raw)"
          class="ml-2 pointer-events-auto"
          :for="`checkbox_${index}_${item.raw}`"
        ></label>
      </div>
      <ul
        v-else-if="item.type === 'listItem'"
        :key="item.raw"
        class="list-inside list-disc ml-1"
      >
        <li v-html="item.raw"></li>
      </ul>
      <p v-else :key="'p' + item.raw" v-html="toInnerHtml(item.raw)"></p>
    </template>
  </div>
</template>

<style scoped></style>
