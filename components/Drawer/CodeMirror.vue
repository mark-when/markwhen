<template>
  <div
    id="codeMirror"
    class="text-base dark:text-slate-300 text-slate-700 h-full"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";
import { EditorState, Extension } from "@codemirror/state";
import { classHighlightStyle } from "@codemirror/highlight";
// import { syntaxTree } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/history";
import { codeFolding, foldGutter } from "@codemirror/fold";
import { foldService } from "@codemirror/language";
import {
  Decoration,
  EditorView,
  keymap,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { mapState, mapGetters } from "vuex";
import { Range as CascadeRange } from "~/src/Types";

const rightCaret = () => {
  let div = document.createElement("div");
  div.className = "h-full flex items-center content-center cursor-pointer";
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>`;
  return div;
};

const downCaret = () => {
  let div = document.createElement("div");
  div.className = "h-full flex items-center content-center cursor-pointer";
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
  return div;
};

let startState = (
  startingText: string,
  onUpdate: (v: ViewUpdate, cascade: string) => void,
  extensions: Extension[] = []
) =>
  EditorState.create({
    doc: startingText,
    extensions: [
      ...extensions,  
      codeFolding(),
      foldGutter({
        markerDOM: (open: boolean) => {
          return !open ? rightCaret() : downCaret();
        },
      }),
      // foldService.of((state, lineStart, lineEnd) => {
      //   console.log(lineStart, lineEnd);
      //   if (lineStart === 0) {
      //     return { from: 0, to: 70 };
      //   }
      //   return null;
      // }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      // cascade(),
      history(),
      classHighlightStyle,
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
          onUpdate(v, v.state.sliceDoc());
        }
        // if (v.selectionSet) {
        //   console.log(v.state.selection.ranges)
        // }
      }),
    ],
  });

const dateRangeMark = Decoration.mark({ class: "cm-daterange" });
const commentMark = Decoration.mark({ class: "cm-comment" });
const sectionMark = Decoration.mark({ class: "cm-section" });

export default Vue.extend({
  props: ["startingText"],
  computed: { ...mapState(["eventsString"]), ...mapGetters(["ranges"]) },
  data() {
    return {
      editorView: null as EditorView | null,
    };
  },
  mounted() {
    const vm = this;
    const CascadeSyntaxPlugin = ViewPlugin.define(
      (view) => {
        return { view };
      },
      {
        decorations(c) {
          // We're doing this here, instead of a view update listener, because it seems like one was
          // getting called before another and the syntax highlighting would be
          // one step behind. So we commit the events string here
          // and then immediately use the computed ranges for syntax highlighting.
          vm.$store.commit(
            "setEventsString",
            (c.view as EditorView).state.sliceDoc()
          );
          return Decoration.set(
            ((vm.ranges as CascadeRange[]) || []).map((r) => {
              if (r.type === "dateRange") {
                return dateRangeMark.range(r.from, r.to);
              }
              if (r.type === "section") {
                return sectionMark.range(r.from, r.to)
              }
              return commentMark.range(r.from, r.to);
            })
          );
        },
      }
    );
    this.editorView = new EditorView({
      state: startState(this.$store.state.eventsString, this.update, [
        CascadeSyntaxPlugin,
      ]),
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
    update(viewUpdate: ViewUpdate, events: string) {
      // this.$store.commit("setEventsString", events);
    },
    setEditorText(text: string) {},
  },
});
</script>

<style>
.cm-editor {
  @apply h-full;
  font-size: 95%;
}

.dark .cm-content {
  @apply caret-slate-300;
}

/* .dark .cmt-keyword {
  @apply text-red-300;
}

.cmt-keyword {
  @apply text-red-700;
} */

.cm-daterange {
  @apply text-red-800;
}

.dark .cm-daterange {
  @apply text-red-600;
}

.cm-comment {
  @apply text-slate-500;
}

.dark .cm-comment {
  @apply text-slate-400;
}

.cm-gutter {
  @apply bg-slate-300;
}

.dark .cm-gutter {
  @apply bg-slate-900;
}

.cm-gutters {
  @apply border-none !important;
}

.dark .cm-section {
  @apply text-blue-400
}

.cm-section {
  @apply text-blue-700
}
</style>