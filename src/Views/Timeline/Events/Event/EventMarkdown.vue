<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type {
  Block,
  Image,
  MarkdownBlock,
  Range,
} from "@markwhen/parser/lib/Types";
import { toInnerHtml } from "../../utilities/innerHtml";

const props = defineProps<{
  supplemental: MarkdownBlock[];
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
          :checked="(item as Block).value"
          @change="onChange(index, !(item as Block).value)"
          :id="`checkbox_${index}_${(item as Block).raw}`"
        />
        <label
          v-html="toInnerHtml((item as Block).raw)"
          class="ml-2 pointer-events-auto"
          :for="`checkbox_${index}_${(item as Block).raw}`"
        ></label>
      </div>
      <ul
        v-else-if="item.type === 'listItem'"
        :key="(item as Block).raw"
        class="list-inside list-disc ml-1"
      >
        <li v-html="(item as Block).raw"></li>
      </ul>
      <p
        v-else-if="item.type === 'text'"
        :key="'p' + (item as Block).raw"
        v-html="toInnerHtml((item as Block).raw)"
      ></p>
      <img v-else :src="(item as Image).link" />
    </template>
  </div>
</template>

<style scoped></style>
