import { computed, ref, toRaw, watchEffect } from "vue";
import type { NodeArray, Node } from "@markwhen/parser/lib/Node";
import type { Timeline } from "@markwhen/parser/lib/Types";
import { useAppStore } from "@/App/appStore";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { usePageStore } from "@/Markwhen/pageStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { useAppSettingsStore } from "@/AppSettings/appSettingsStore";
import { useRoute } from "vue-router";

export type EventPaths = { [pathType in EventPath["type"]]?: EventPath };

export interface EventPath {
  type: "whole" | "page" | "pageFiltered";
  path: number[];
}

export interface AppState {
  isDark?: boolean;
  hoveringPath?: EventPaths;
  detailPath?: EventPath;
  pageIndex: number;
}
export interface MarkwhenState {
  rawText?: string;
  parsed?: Timeline[];
  page?: PageState;
}
export interface PageState {
  parsed?: Timeline;
  transformed?: Node<NodeArray>;
}
export interface State {
  app?: AppState;
  markwhen?: MarkwhenState;
}

export const equivalentPaths = (p1?: EventPath, p2?: EventPath): boolean => {
  if (!p1 || !p2 || p1.type !== p2.type) {
    return false;
  }
  const path1 = p1.path;
  const path2 = p2.path;

  return (
    path1.length > 0 &&
    path2.length > 0 &&
    path1.length === path2.length &&
    path1.every((pathValue, index) => path2[index] === pathValue)
  );
};

export const useStateSerializer = () => {
  const appSettingsStore = useAppSettingsStore();
  const markwhenStore = useMarkwhenStore();
  const pageStore = usePageStore();
  const transformStore = useTransformStore();
  const editorOrchestrator = useEditorOrchestratorStore();
  const eventDetailStore = useEventDetailStore();
  const route = useRoute()

  const state = computed<State>(() => ({
    app: {
      isDark: appSettingsStore.inferredDarkMode,
      hoveringPath: toRaw(editorOrchestrator.hoveringEventPaths) || undefined,
      detailPath: toRaw(eventDetailStore.detailEventPath),
      pageIndex: pageStore.pageIndex,
      path: route.path
    },
    markwhen: {
      rawText: markwhenStore.rawTimelineString,
      parsed: markwhenStore.timelines,
      page: {
        parsed: pageStore.pageTimeline,
        transformed: transformStore.transformedEvents,
      },
    },
  }));

  return state;
};
