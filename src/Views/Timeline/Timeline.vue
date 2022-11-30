<script setup lang="ts">
import {
  onMounted,
  ref,
  watch,
  nextTick,
  onActivated,
  computed,
  watchEffect,
} from "vue";
import { useTimelineStore, type Viewport } from "./timelineStore";
import TimeMarkersBack from "@/Views/Timeline/Markers/TimeMarkersBack.vue";
import TimeMarkersFront from "@/Views/Timeline/Markers/TimeMarkersFront.vue";
import Events from "@/Views/Timeline/Events/Events.vue";
import { useGestures } from "@/Views/Timeline/composables/useGestures";
import { useHoveringMarker } from "@/Views/Timeline/composables/useHoveringMarker";
import { usePanning } from "./composables/usePanning";
import { DateTime } from "luxon";
import { usePageStore } from "@/Markwhen/pageStore";
import { useResizeObserver } from "@vueuse/core";
import { useIsActive } from "@/utilities/composables/useIsActive";
import { PanelVisualization, usePanelStore } from "@/Panels/panelStore";
import JumpToRangeDialog from "@/Jump/JumpToRangeDialog.vue";
import type { DateRangePart } from "@markwhen/parser/lib/Types";
import { dateMidpoint, eventMidpoint } from "./utilities/dateTimeUtilities";
import { useEventFinder } from "@/Markwhen/composables/useEventFinder";

const timelineStore = useTimelineStore();
const pageStore = usePageStore();
const panelStore = usePanelStore();

const timelineElement = ref<HTMLDivElement | null>(null);
const { isActive } = useIsActive();
const finder = useEventFinder();

const getViewport = (): Viewport => {
  if (!timelineElement.value) {
    return { left: 0, width: 0, top: 0 };
  }
  return {
    left: timelineElement.value.scrollLeft - timelineElement.value.offsetLeft,
    width: timelineElement.value.clientWidth + timelineElement.value.offsetLeft,
    top: timelineElement.value.scrollTop,
  };
};

const setViewport = (v: Viewport) => {
  if (!timelineElement.value) {
    return;
  }
  timelineElement.value.scrollLeft = v.left;
  timelineElement.value.scrollTop = v.top;
};

// This needs to be separate from the watch below, for some reason
watch(
  () => timelineStore.pageSettings,
  (settings) => {
    const vp = { ...settings.viewport };
    nextTick(() => setViewport(vp));
  }
);

const widthChangeStartScrollLeft = ref<number | null>(null);
const widthChangeStartYearWidth = ref<number | null>(null);
watch(
  () => timelineStore.startedWidthChange,
  (started) => {
    // console.log(
    //   timelineElement.value?.offsetLeft,
    //   timelineElement.value?.scrollLeft
    // );
    const scrollLeft = timelineElement.value?.scrollLeft || 0;
    widthChangeStartScrollLeft.value = started ? scrollLeft ?? null : null;
    widthChangeStartYearWidth.value = timelineStore.pageSettings.scale;
  }
);

const setScaleVariable = (s: number) => {
  document
    .getElementById("timeline")
    ?.style.setProperty("--timeline-scale", `${s}`);
  document
    .getElementById("timeline")
    ?.style.setProperty("--timeline-scale-by-24", `${s / 24}`);
};
const scale = computed(() => timelineStore.pageScale);
watch(scale, setScaleVariable);
onMounted(() => setScaleVariable(scale.value));

watch(
  () => timelineStore.pageSettings,
  (settings) => {
    if (!timelineStore.startedWidthChange || !timelineElement.value) {
      return;
    }
    const startCenter =
      widthChangeStartScrollLeft.value! + timelineElement.value.clientWidth / 2;
    const scale = settings.scale / (widthChangeStartYearWidth.value || 1);
    timelineElement.value.scrollLeft =
      scale * startCenter - timelineElement.value.clientWidth / 2;
  },
  { deep: true }
);
watch(
  [
    () => pageStore.pageIndex,
    () => pageStore.pageTimelineMetadata.earliestTime,
    () => pageStore.pageTimelineMetadata.latestTime,
    () => panelStore.visualizationPanelState,
  ],
  () => {
    if (isActive.value) {
      nextTick(setViewportDateInterval);
    }
  }
);
useResizeObserver(timelineElement, (entries) => {
  if (isActive.value) {
    nextTick(setViewportDateInterval);
  }
});

const setViewportDateInterval = () => {
  timelineStore.setViewport(getViewport());
};

const { trigger } = useHoveringMarker(timelineElement);
const scroll = () => {
  setViewportDateInterval();
  trigger();
};

const { isPanning } = usePanning(timelineElement);
useGestures(timelineElement, () => {
  setViewportDateInterval();
});

const scrollToDate = (dateTime: DateTime, force: boolean = false) => {
  const el = timelineElement.value;
  if (el) {
    const fromLeft = timelineStore.distanceFromBaselineLeftmostDate(dateTime);
    const { left, width } = getViewport();

    // If it isn't already within view
    if (force || fromLeft < left || fromLeft > left + width) {
      el.scrollTo({
        top: el.scrollTop,
        left: fromLeft - width / 2,
        behavior: "smooth",
      });
    }
  }
};

const scrollToDateRange = (dateRange?: DateRangePart) => {
  if (!dateRange) {
    return;
  }
  if (timelineStore.shouldZoomWhenScrolling) {
    const { width } = getViewport();
    // We still want to be zoomed out a bit
    const scale = timelineStore.scaleToGetDistance(width, dateRange) / 3;
    timelineStore.setPageScale(scale);
    nextTick(() => {
      scrollToDate(dateMidpoint(dateRange));
      setViewportDateInterval();
    });
  } else {
    scrollToDate(dateMidpoint(dateRange), true);
  }
};

watch(
  () => timelineStore.scrollToPath,
  (path) => {
    if (!timelineStore.shouldZoomWhenScrolling) {
      return;
    }

    const event = finder(path);
    if (!event) {
      return;
    }

    const range = event.isEventNode()
      ? event.eventValue().ranges.date
      : event.range?.fromDateTime && event.range.toDateTime
      ? event.range
      : undefined;

    if (!range) {
      return;
    }

    const { width } = getViewport();
    // We still want to be zoomed out a bit
    const scale = timelineStore.scaleToGetDistance(width, range) / 3;
    timelineStore.setPageScale(scale);
    const midpoint = eventMidpoint(event);
    if (midpoint) {
      nextTick(() => {
        scrollToDate(midpoint);
        setViewportDateInterval();
      });
    }
  }
);

watch(
  () => timelineStore.jumpToRange,
  (range) => range && scrollToDateRange(range)
);

const scrollToNow = () => scrollToDate(DateTime.now(), true);
watch(
  () => timelineStore.hideNowLine,
  (hide) => scrollToNow()
);

const viewport = computed(() => timelineStore.pageSettings.viewport);
onActivated(() => {
  const viewportWithOffset = {
    left: viewport.value.left + (timelineElement.value?.offsetLeft || 0),
    top: viewport.value.top - (timelineElement.value?.offsetTop || 0),
    width: viewport.value.width,
  };
  nextTick(() => setViewport(viewportWithOffset));
});

onMounted(() => {
  setViewportDateInterval();
  panelStore.setPanelElement(PanelVisualization, timelineElement.value!);
});

const showJumpToRange = computed({
  get() {
    return timelineStore.showingJumpToRange;
  },
  set(val) {
    timelineStore.setShowingJumpToRange(val);
  },
});
</script>

<template>
  <div
    id="timeline"
    class="relative h-full overflow-auto w-full noScrollBar"
    ref="timelineElement"
    @scroll="scroll"
    :style="{ cursor: isPanning ? 'grabbing' : 'grab' }"
  >
    <TimeMarkersBack />
    <Events />
    <TimeMarkersFront />
  </div>
  <JumpToRangeDialog v-model="showJumpToRange" />
</template>

<style></style>
