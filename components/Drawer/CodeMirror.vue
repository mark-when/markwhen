<template>
  <div
    id="codeMirror"
    class="text-base dark:text-slate-300 text-slate-700 h-full"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";
import { EditorState, Extension, StateField } from "@codemirror/state";
import { classHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { codeFolding, foldGutter } from "@codemirror/fold";
import { foldService } from "@codemirror/language";
import {
  Decoration,
  EditorView,
  keymap,
  PluginValue,
  ViewPlugin,
} from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { mapState, mapGetters } from "vuex";
import { Cascade, Range as CascadeRange } from "~/src/Types";
import { Foldable } from "~/src/Parser";

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

let startState = (startingText: string, extensions: Extension[] = []) =>
  EditorState.create({
    doc: startingText,
    extensions: [
      codeFolding(),
      foldGutter({
        markerDOM: (open: boolean) => {
          return !open ? rightCaret() : downCaret();
        },
      }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      history(),
      classHighlightStyle,
      EditorView.lineWrapping,
      ...extensions,
    ],
  });

const dateRangeMark = Decoration.mark({ class: "cm-daterange" });
const commentMark = Decoration.mark({ class: "cm-comment" });
const sectionMark = Decoration.mark({ class: "cm-section" });
const tagMark = Decoration.mark({ class: "cm-tag" });

export default Vue.extend({
  props: ["startingText"],
  computed: {
    ...mapState(["eventsString"]),
    ...mapGetters(["ranges", "cascade"]),
  },
  data() {
    return {
      editorView: null as EditorView | null,
    };
  },
  mounted() {
    this.editorView = new EditorView({
      state: startState(
        this.$store.state.eventsString,
        // this.update,
        this.codeMirrorExtensions()
      ),
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
    // eventsString(val, oldVal) {
    //   if (val === this.editorView?.state.sliceDoc()) {
    //     return;
    //   }
    //   this.setEditorText(val);
    // },
  },
  methods: {
    cascadeExtension(): Extension {
      const vm = this;
      const cascadeField = StateField.define<Cascade>({
        create() {
          return vm.cascade as Cascade;
        },
        update(cascade, transaction) {
          if (transaction.docChanged) {
            vm.$store.commit("setEventsString", transaction.state.sliceDoc());
            return vm.cascade;
          }
          return cascade;
        },
      });
      return cascadeField.extension;
    },
    setEditorText(text: string) {},
    codeMirrorExtensions(): Extension[] {
      const vm = this;
      interface S extends PluginValue {
        state: EditorState;
      }
      const CascadeSyntaxPlugin = ViewPlugin.define<S>(
        (view) => {
          return { state: view.state };
        },
        {
          decorations({ state }) {
            return Decoration.set(
              ((vm.ranges as CascadeRange[]) || [])
                .map((r) => {
                  if (r.type === "dateRange") {
                    return dateRangeMark.range(r.from, r.to);
                  }
                  if (r.type === "section") {
                    return sectionMark.range(r.from, r.to);
                  }
                  if (r.type === "tag") {
                    return tagMark.range(r.from, r.to);
                  }
                  return commentMark.range(r.from, r.to);
                })
                .sort((a, b) => a.from - b.from)
            );
          },
        }
      );
      const foldingService = foldService.of((state, lineStart, lineEnd) => {
        const foldableAtIndex = vm.cascade.foldables[lineStart] as Foldable;
        if (foldableAtIndex) {
          if (foldableAtIndex.type === "comment") {
            return {
              from:
                foldableAtIndex.foldStartIndex || foldableAtIndex.startIndex!,
              to: foldableAtIndex.endIndex,
            };
          } else if (foldableAtIndex.type === "section") {
            return {
              from:
                foldableAtIndex.foldStartIndex || foldableAtIndex.startIndex!,
              to: foldableAtIndex.endIndex,
            };
          }
        }
        return null;
      });
      return [foldingService, CascadeSyntaxPlugin, this.cascadeExtension()];
    },
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
  @apply text-purple-400;
}

.cm-section {
  @apply text-purple-800;
}

.dark .cm-foldPlaceholder {
  @apply bg-slate-700 border border-slate-700 text-slate-100 !important;
}

.cm-foldPlaceholder {
  @apply bg-slate-400 border border-slate-400 text-slate-100 !important;
}

.dark .cm-tag {
  @apply text-blue-400
}

.cm-tag {
  @apply text-blue-700
}
</style>