import { defineStore } from "pinia";
import { useMagicKeys, useActiveElement, whenever } from "@vueuse/core";
import { computed, type ComputedRef, type Ref } from "vue";
import { useAppStore } from "@/App/appStore";
import { usePanelStore } from "@/Panels/panelStore";
import { useSidebarStore } from "@/Sidebar/sidebarStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";

export const useKeyboardStore = defineStore("keyboard", () => {
  const sidebarStore = useSidebarStore();
  const panelStore = usePanelStore();
  const activeElement = useActiveElement();
  const appStore = useAppStore();
  const timelineStore = useTimelineStore();
  const eventDetailStore = useEventDetailStore();

  const notUsingInput = computed(
    () =>
      activeElement.value?.tagName !== "INPUT" &&
      activeElement.value?.tagName !== "TEXTAREA" &&
      !activeElement.value?.isContentEditable
  );

  const { l, d, t, z, j } = useMagicKeys();
  const period = useMagicKeys()["."];
  const comma = useMagicKeys()[","];

  const and = (a: Ref<boolean>, b: Ref<boolean>) =>
    computed(() => a.value && b.value);

  const key = (k: ComputedRef<boolean>, f: () => void) =>
    whenever(and(notUsingInput, k), f);

  key(l, appStore.toggleDarkMode);
  key(d, () =>
    panelStore.setVisibility("detail", !panelStore.detailPanelState.visible)
  );
  // timeline
  key(t, () => {});
  // map
  key(z, sidebarStore.toggle);
  key(j, () =>
    timelineStore.setShowingJumpToRange(!timelineStore.showingJumpToRange)
  );
  key(comma, () => {
    if (eventDetailStore.prev) {
      eventDetailStore.setDetailEventPath(eventDetailStore.prev);
    }
  });
  key(period, () => {
    if (eventDetailStore.next) {
      eventDetailStore.setDetailEventPath(eventDetailStore.next);
    }
  });
});
