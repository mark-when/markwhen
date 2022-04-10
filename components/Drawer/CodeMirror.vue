<template>
  <div id="codeMirror" class="text-base"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { cascade } from "~/src/codeMirrorParser";

let startState = EditorState.create({
  doc: "Hello World",
  extensions: [
    keymap.of(defaultKeymap),
    cascade(),
    EditorView.updateListener.of((v: ViewUpdate) => {
      const tree = syntaxTree(v.state);
      const cursor = tree.cursor();
      function topLevelNodes(x) {
        do {
          console.log(x.name, "at", x.from, "to", x.to);
        } while (x.next());
        console.log(" ");
      }
      topLevelNodes(cursor);
      if (v.docChanged) {
        // Document changed
      }
    }),
  ],
});

export default Vue.extend({
  mounted() {
    new EditorView({
      state: startState,
      parent: this.$el,
    });
  },
});
</script>

<style>
</style>