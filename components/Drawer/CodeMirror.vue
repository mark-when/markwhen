<template>
  <div
    id="codeMirror"
    class="text-base dark:text-slate-300 text-slate-700 h-full"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";
import { EditorState } from "@codemirror/state";
// import { syntaxTree } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/history";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { cascade } from "~/src/codeMirrorParser";
import { mapState } from "vuex";

let startState = (startingText: string, onUpdate: (cascade: string) => void) =>
  EditorState.create({
    doc: startingText,
    extensions: [
      keymap.of([...defaultKeymap, ...historyKeymap]),
      cascade(),
      history(),
      EditorView.lineWrapping,
      EditorView.updateListener.of((v: ViewUpdate) => {
        // const tree = syntaxTree(v.state);
        // const cursor = tree.cursor();
        // function topLevelNodes(x) {
        //   do {
        //     console.log(x.name, "at", x.from, "to", x.to);
        //   } while (x.next());
        //   console.log(" ");
        // }
        // topLevelNodes(cursor);
        if (v.docChanged) {
          onUpdate(v.state.sliceDoc());
        }
      }),
    ],
  });

export default Vue.extend({
  props: ["startingText"],
  computed: mapState(["eventsString"]),
  data() {
    return {
      editorView: null as EditorView | null,
    };
  },
  mounted() {
    this.editorView = new EditorView({
      state: startState(this.$store.state.eventsString, this.update),
      parent: this.$el,
    });
    this.setEditorText = (newText) => {
      this.editorView!.dispatch(
        this.editorView!.state.update({
          changes: {
            from: 0,
            to: this.editorView!.state.doc.length,
            insert: newText,
          },
        })
      );
    };
  },
  watch: {
    eventsString(val, oldVal) {
      if (val === this.editorView?.state.sliceDoc()) {
        return;
      }
      this.setEditorText(val);
    },
  },
  methods: {
    update(events: string) {
      this.$store.commit("setEventsString", events);
    },
    setEditorText(text: string) {},
  },
});
</script>

<style>
.cm-editor {
  @apply h-full;
}

.cm-cursor {
  color: red !important;
  background-color: red !important;
  border: 1px solid red !important;
}
</style>