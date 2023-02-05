import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import { useEventFinder } from "@/Views/ViewOrchestrator/useEventFinder";
import { PanelDetail, usePanelStore } from "@/Panels/panelStore";
import { getLast } from "@markwhen/parser/lib/Noder";
import { equivalentPaths, type EventPath } from "@/Views/ViewOrchestrator/useStateSerializer";

export const useEventDetailStore = defineStore("eventDetail", () => {
  const panelStore = usePanelStore();

  const detailEventPath = usePageEffect(
    () => undefined as EventPath | undefined
  );
  const shouldOpenDetailWhenJumping = ref(false);
  const detailEvent = useEventFinder(detailEventPath);

  const setShouldOpenDetailWhenJumping = (should: boolean) => {
    shouldOpenDetailWhenJumping.value = should;
  };
  watch(
    () => panelStore.detailPanelState.visible,
    (visible) => {
      if (!visible) {
        detailEventPath.value = undefined;
      }
    }
  );

  const toggle = () => {
    const show = !panelStore.detailPanelState.visible;
    panelStore.setVisibility(PanelDetail, show);
    if (!show) {
      detailEventPath.value = undefined;
    }
  };

  const clearDetailEventPath = () => {
    detailEventPath.value = undefined;
  };

  const setDetailEventPath = (path: EventPath) => {
    if (equivalentPaths(path, detailEventPath.value)) {
      detailEventPath.value = undefined;
    } else {
      detailEventPath.value = path;
      panelStore.setVisibility(PanelDetail, true);
    }
  };

  const isDetailEventPath = computed(
    () => (path: EventPath | undefined) =>
      !!path && equivalentPaths(path, detailEventPath.value)
  );

  const prev = computed<EventPath | undefined>(() => {
    if (!detailEventPath.value) {
      return;
    }
    const { path, type } = detailEventPath.value;
    if (!path.length) {
      return undefined;
    }

    let tempPath = path;
    const last = () => tempPath[tempPath.length - 1];
    do {
      if (last() > 0) {
        tempPath = [...tempPath.slice(0, -1), last() - 1];
        if (!tempPath.length) {
          return undefined;
        }
        const possibleSibling = useEventFinder({ type, path: tempPath });
        if (possibleSibling.value) {
          const lastOfSibling = getLast(possibleSibling.value);
          return {
            type,
            path: [...tempPath, ...lastOfSibling.path],
          };
        }
      } else {
        tempPath = [...tempPath.slice(0, -1)];
        if (!tempPath.length) {
          return undefined;
        }
        const possibleNode = useEventFinder({
          type,
          path: tempPath,
        });
        if (possibleNode.value) {
          return {
            type,
            path: tempPath,
          };
        }
      }
    } while (tempPath.length);
  });

  const next = computed<EventPath | undefined>(() => {
    if (!detailEventPath.value) {
      return;
    }
    const { path, type } = detailEventPath.value;
    if (!path.length) {
      return undefined;
    }
    // [0, 3, 6, 1, 0]
    let tempPath = path;
    let pathAttempt = [...tempPath, 0];
    let possibleNode = useEventFinder({
      type,
      // next nested group
      path: pathAttempt,
    });
    if (possibleNode.value) {
      return {
        type,
        path: pathAttempt,
      };
    }
    do {
      pathAttempt = [
        ...tempPath.slice(0, -1),
        tempPath[tempPath.length - 1] + 1,
      ];
      possibleNode = useEventFinder({
        type,
        // next sibling
        path: pathAttempt,
      });
      if (possibleNode.value) {
        return {
          type,
          path: pathAttempt,
        };
      }
      if (tempPath.length > 1) {
        // only try this is we're at the right level
        pathAttempt = [
          ...tempPath.slice(0, -2),
          tempPath[tempPath.length - 2] + 1,
        ];
        possibleNode = useEventFinder({
          type,
          // next uncle
          path: pathAttempt,
        });
        if (possibleNode.value) {
          return {
            type,
            path: pathAttempt,
          };
        }
      }
      // go up one and continue
      tempPath = tempPath.slice(0, -1);
    } while (tempPath.length);
  });

  return {
    // state
    detailEvent,
    detailEventPath,
    shouldOpenDetailWhenJumping,

    // actions
    setDetailEventPath,
    toggle,
    setShouldOpenDetailWhenJumping,
    clearDetailEventPath,

    // getters
    isDetailEventPath,
    prev,
    next,
  };
});
