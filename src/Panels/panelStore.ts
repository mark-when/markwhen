import { newOrder } from "@/EditorOrchestrator/editorOrchestratorStore";
import { defineStore } from "pinia";
import { computed, markRaw, ref, watch } from "vue";

export const PanelVisualization = "visualization";
export const PanelDetail = "detail";

type PanelName =
  | typeof PanelVisualization
  | typeof PanelDetail

interface Panel {
  name: PanelName;
  visible: boolean;
  translation: number;
  width?: number;
}

const getPanelConfiguration = () => {
  if (typeof localStorage === "undefined" || !localStorage) {
    return;
  }
  const savedConfiguration = localStorage.getItem("panelConfiguration");
  if (!savedConfiguration) {
    return;
  }
  try {
    const parsed = JSON.parse(savedConfiguration) as Panel[];
    return parsed.map((panel) => ({
      ...panel,
      translattion: 0,
    }));
  } catch {
    return;
  }
};

export const usePanelStore = defineStore("panels", () => {
  const panels = ref<Panel[]>([
    { name: PanelVisualization, visible: true, translation: 0 },
    { name: PanelDetail, visible: false, width: 250, translation: 0 },
  ]);

  const elementMap: { [key in PanelName]: HTMLElement | undefined } = {
    [PanelVisualization]: undefined,
    [PanelDetail]: undefined,
  };

  const moveFrom = ref(0);
  const moveTo = ref(0);
  const isMoving = ref(false);

  const setPanelElement = (panel: PanelName, element: HTMLElement) => {
    if (panel === PanelDetail) {
      elementMap[PanelDetail] = markRaw(element);
    } else if (panel === PanelVisualization) {
      elementMap[PanelVisualization] = markRaw(element);
    }
  };

  const index = computed(
    () => (name: PanelName) => panels.value.findIndex((p) => p.name === name)
  );

  const panelState = computed(() => (panel: PanelName) => {
    const i = index.value(panel);
    return {
      order: i,
      ...panels.value[i],
    };
  });

  const detailPanelState = computed(() => panelState.value(PanelDetail));
  const visualizationPanelState = computed(() =>
    panelState.value(PanelVisualization)
  );

  const setVisibility = (panel: PanelName, visible: boolean) => {
    if (panel !== PanelVisualization) {
      panels.value[index.value(panel)].visible = visible;
    }
  };

  const setWidth = (panel: PanelName, width: number) => {
    if (panel !== PanelVisualization) {
      panels.value[index.value(panel)].width = width;
    }
  };

  const moving = (panel: PanelName, translation: number) => {
    isMoving.value = true;
    const onlyVisiblePanels = panels.value.filter((panel) => panel.visible);
    moveFrom.value = onlyVisiblePanels.findIndex((p) => p.name === panel);

    const positions = onlyVisiblePanels.map((panel) => {
      const element = elementMap[panel.name];
      const from = element?.offsetLeft || 0;
      const to = from + (element?.clientWidth || 0);
      return {
        panel: panel.name,
        from,
        to,
        midpoint: (to + from) / 2,
      };
    });

    const movingPanel =
      positions[positions.findIndex((p) => p.panel === panel)];
    const newRightEdge = movingPanel.to + translation;
    const newLeftEdge = movingPanel.from + translation;

    let leftOf = positions.length - 1;
    let rightOf = 0;

    for (let i = 0; i < positions.length; i++) {
      const panelPosition = positions[i];
      if (newRightEdge > panelPosition.midpoint) {
        rightOf = Math.max(i, rightOf);
      }
      if (newLeftEdge < panelPosition.midpoint) {
        leftOf = Math.min(leftOf, i);
      }
    }
    const newIndex = translation < 0 ? leftOf : rightOf;
    moveTo.value = newIndex;

    // We only need to change elements that are between `newIndex` and `timelineIndex`
    const movingPanelIndex = onlyVisiblePanels.findIndex(
      (p) => p.name === panel
    );
    const rangeStart = Math.min(newIndex, movingPanelIndex);
    const rangeEnd = Math.max(newIndex, movingPanelIndex);
    for (let i = 0; i < positions.length; i++) {
      const index = panels.value.findIndex(
        (p) => p.name === positions[i].panel
      );
      if (i >= rangeStart && i <= rangeEnd) {
        if (i === movingPanelIndex) {
          continue;
        }
        if (i > movingPanelIndex) {
          panels.value[index].translation = -(
            movingPanel.to - movingPanel.from
          );
        } else {
          panels.value[index].translation = movingPanel.to - movingPanel.from;
        }
      } else {
        panels.value[index].translation = 0;
      }
    }
  };

  const doneMoving = () => {
    isMoving.value = false;
    if (moveFrom.value === moveTo.value) {
      return;
    }
    const visiblePanels = panels.value.filter((p) => p.visible);
    let from: number, to: number;
    if (visiblePanels.length === panels.value.length) {
      from = moveFrom.value;
      to = moveTo.value;
    } else {
      // only have two showing, find out which ones we're referring to amongst all
      // of them, not just the ones that are visible
      from = panels.value.findIndex(
        (p) => visiblePanels[moveFrom.value].name === p.name
      );
      to = panels.value.findIndex(
        (p) => visiblePanels[moveTo.value].name === p.name
      );
    }
    const order = newOrder(
      panels.value.map((p, i) => i),
      from,
      to
    );
    panels.value = order.map((i) => ({ ...panels.value[i], translation: 0 }));
  };

  watch(
    panels,
    () => {
      if (localStorage) {
        localStorage.setItem(
          "panelConfiguration",
          JSON.stringify(
            panels.value.map((p) => {
              const { translation, ...rest } = p;
              return rest;
            })
          )
        );
      }
    },
    { deep: true }
  );

  return {
    // state
    panels,

    // actions
    setVisibility,
    setWidth,
    setPanelElement,
    moving,
    doneMoving,

    // getters
    isMoving,
    detailPanelState,
    visualizationPanelState,
  };
});
