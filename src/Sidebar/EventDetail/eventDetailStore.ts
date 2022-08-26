import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSidebarStore } from "../sidebarStore";
import { equivalentEvents } from "@/EditorOrchestrator/editorOrchestratorStore";
import type { Event } from "@markwhen/parser/lib/Types";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";

export const useEventDetailStore = defineStore("eventDetail", () => {
  const sidebarStore = useSidebarStore();

  const width = ref(450);
  const visible = ref(false);
  const detailEvent = usePageEffect(() => null as Event | null);

  const setWidth = (w: number) => {
    width.value = w;
  };

  const toggle = () => {
    visible.value = !visible.value;
  };

  const setDetailEvent = (e: Event | null) => {
    detailEvent.value = e;
    if (!!e) {
      visible.value = true
    }
  };

  const isLeft = computed(() => !sidebarStore.isLeft);
  const isDetailEvent = (e: Event) => equivalentEvents(e, detailEvent.value);

  return {
    // state
    visible,
    width,
    detailEvent,

    // actions
    setWidth,
    setDetailEvent,
    toggle,

    // getters
    isLeft,
    isDetailEvent,
  };
});
