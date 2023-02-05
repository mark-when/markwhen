<script setup lang="ts">
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import type {
  Block,
  Image,
  MarkdownBlock,
  Range,
} from "@markwhen/parser/lib/Types";
import { toInnerHtml } from "./utilities/innerHtml";

const props = defineProps<{
  supplemental: MarkdownBlock[];
  matchedListItems: Range[];
}>();

const editorOrchestrator = useEditorOrchestratorStore();
const onChange = (index: number, checked: boolean) => {
  // This is more wonky than it needs to be
  // Go through supplemental and get the index in terms of checkboxs of this checkbox
  // Then match it with the list of ranges we have, and update that range
  let checkboxIndex = -1;
  for (let i = 0; i < props.supplemental.length; i++) {
    const s = props.supplemental[i];
    if (s.type === "checkbox") {
      checkboxIndex++;
      if (index === i) {
        break;
      }
    }
  }

  const range = (props.matchedListItems as Range[]).filter(
    (r) => r.type === "checkboxItemIndicator"
  )[checkboxIndex];
  if (!range) {
    console.error("Couldn't find range");
    return;
  }

  editorOrchestrator.setText(`- [${checked ? "x" : " "}]`, {
    from: range.from,
    to: range.to,
  });
};
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
          :disabled="!editorOrchestrator.editable"
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
      <img v-else :src="(item as Image).link" class="py-4" />
    </template>
  </div>
</template>

<style scoped></style>
