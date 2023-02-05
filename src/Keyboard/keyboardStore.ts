import { defineStore } from "pinia";
import { useMagicKeys, useActiveElement, whenever } from "@vueuse/core";
import { computed, type ComputedRef, type Ref } from "vue";
import { useAppStore } from "@/App/appStore";
import { usePanelStore } from "@/Panels/panelStore";
import { useSidebarStore } from "@/Sidebar/sidebarStore";
import { useEventDetailStore } from "@/EventDetail/eventDetailStore";
import { useTransformStore } from "@/Markwhen/transformStore";
import { getLast } from "@markwhen/parser/lib/Noder";
import { useAppSettingsStore } from "@/AppSettings/appSettingsStore";
import { useJumpStore } from "@/Jump/jumpStore";

export const useKeyboardStore = defineStore("keyboard", () => {
  const sidebarStore = useSidebarStore();
  const panelStore = usePanelStore();
  const activeElement = useActiveElement();
  const appSettingsStore = useAppSettingsStore();
  const jumpStore = useJumpStore();
  const eventDetailStore = useEventDetailStore();
  const transformStore = useTransformStore();

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

  key(l, appSettingsStore.toggleDarkMode);
  key(d, () =>
    panelStore.setVisibility("detail", !panelStore.detailPanelState.visible)
  );
  // timeline
  key(t, () => {});
  // map
  key(z, sidebarStore.toggle);
  key(j, () => jumpStore.setShowJumpDialog(!jumpStore.showingJumpDialog));
  key(comma, () => {
    if (!eventDetailStore.detailEventPath) {
      const last =
        transformStore.transformedEvents &&
        getLast(transformStore.transformedEvents).path;
      if (last) {
        eventDetailStore.setDetailEventPath({
          type: "pageFiltered",
          path: last,
        });
      }
    } else if (eventDetailStore.prev) {
      eventDetailStore.setDetailEventPath(eventDetailStore.prev);
    }
  });
  key(period, () => {
    if (!eventDetailStore.detailEventPath) {
      eventDetailStore.setDetailEventPath({ type: "pageFiltered", path: [0] });
    } else if (eventDetailStore.next) {
      eventDetailStore.setDetailEventPath(eventDetailStore.next);
    }
  });
});
