<template>
  <div
    id="timeline"
    class="relative h-full overflow-auto w-full order-1"
    :class="{ 'md:order-1': isRight, 'md:order-2': !isRight }"
    @touchstart="touchStart"
    @mousedown.prevent="panStart"
    @scroll="scroll"
    :style="eventsStyle"
  >
    <TimeMarkersBack :markers="markers" />
    <events
      :newEventPosition="newEventPosition"
      @startMakingEvent="startMakingEvent"
    />
    <TimeMarkersFront :markers="markers" />
    <drawer-header />
    <resize-observer @notify="handleResize" />
  </div>
</template>

<script lang="ts">
import Events from "./Events.vue";
import Vue from "vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
// @ts-ignore
import Hammer from "@squadette/hammerjs";
import { mapState, mapGetters } from "vuex";
import { zoomer, WheelGesture } from "~/src/zoomer";
import {
  DateTimeAndOffset,
  MAX_SCALE,
  OffsetRange,
  Settings,
  TimeMarker,
} from "~/store";
import { throttle } from "throttle-debounce";
import TimeMarkersBack from "./TimeMarkersBack.vue";
import TimeMarkersFront from "./TimeMarkersFront.vue";
// @ts-ignore
import { ResizeObserver } from "vue-resize";
import "vue-resize/dist/vue-resize.css";
/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 */

export default Vue.extend({
  components: {
    Events,
    DrawerHeader,
    TimeMarkersBack,
    TimeMarkersFront,
    ResizeObserver,
  },
  data() {
    return {
      mc: null as any,
      panningInfo: null as any,
      panStartX: null as number | null,
      panStartY: null as number | null,
      panStartScrollLeft: null as number | null,
      panStartScrollTop: null as number | null,
      startingZoom: null as number | null,
      pinchStartScrollLeft: null as number | null,
      pinchStartScrollTop: null as number | null,
      pinchStartCenterX: null as number | null,
      pinchStartCenterY: null as number | null,
      widthChangeStartScrollLeft: null as number | null,
      widthChangeStartYearWidth: null as number | null,
      markers: [] as TimeMarker[],
      mouseLeft: 0,
      startEventCreationRange: undefined as OffsetRange | undefined,
      creatingEventRange: undefined as OffsetRange | undefined,
    };
  },
  created() {
    this.throttledSetViewportDateInterval = throttle(
      200,
      this.setViewportDateInterval
    );
  },
  mounted() {
    this.touchScreenListener();
    this.setupZoomer();
    this.setViewportDateInterval();
    if (this.$store.state.editable) {
      window.addEventListener("mousemove", this.moveListener);
    }
  },
  watch: {
    timeMarkers(newMarkers: TimeMarker[], oldMarkers: TimeMarker[]) {
      this.setNewMarkers(newMarkers);
    },
    startedWidthChange(val) {
      this.widthChangeStartScrollLeft = val ? this.$el.scrollLeft : null;
      this.widthChangeStartYearWidth = this.settings.scale;
    },
    settings: {
      handler: function (val: Settings, oldVal) {
        if (!this.startedWidthChange) {
          return;
        }
        const startCenter =
          this.widthChangeStartScrollLeft! + this.$el.clientWidth / 2;
        const scale = val.scale / this.widthChangeStartYearWidth!;
        this.$el.scrollLeft = scale * startCenter - this.$el.clientWidth / 2!;
      },
      deep: true,
    },
    cascadeIndex(val) {
      const vm = this;
      this.markers = [...this.markers];
      Vue.nextTick(() => {
        vm.$el.scrollLeft = (this.settings as Settings).viewport.left;
        vm.$el.scrollTop = (this.settings as Settings).viewport.top;
        vm.setViewportDateInterval();
      });
    },
    sidebarSide(val) {
      this.setViewportDateInterval();
    },
    sidebarVisible(val) {
      this.setViewportDateInterval();
    },
    selectedComponent(val) {
      this.setViewportDateInterval();
    },
  },
  computed: {
    ...mapState({
      cascadeIndex: (state: any) => state.cascadeIndex,
      startedWidthChange: (state: any) => state.startedWidthChange,
      sidebarSide: (state: any) => state.sidebar.position,
      sidebarVisible: (state: any) => state.sidebar.visible,
      selectedComponent: (state: any) => state.sidebar.selectedComponent,
    }),
    eventsStyle(): string {
      return `cursor: ${this.panStartX ? "grabbing" : "grab"};`;
    },
    ...mapGetters(["timeMarkers", "settings", "rangeFromOffsetLeft"]),
    isRight(): boolean {
      return this.$store.state.sidebar.position === "right";
    },
    newEventPosition(): OffsetRange {
      return this.creatingEventRange
        ? this.creatingEventRange
        : this.rangeFromOffsetLeft(this.mouseLeft);
    },
  },
  methods: {
    startMakingEvent(e: MouseEvent | TouchEvent) {
      this.startEventCreationRange = this.newEventPosition;
      window.addEventListener("touchmove", this.extendCreatingEvent);
      window.addEventListener("touchend", this.createEventFromRange);
      window.addEventListener("mousemove", this.extendCreatingEvent);
      window.addEventListener("mouseup", this.createEventFromRange);
      window.addEventListener("keydown", this.stopCreatingKeyboardListener);
    },
    stopCreatingKeyboardListener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        this.stopCreating();
      }
    },
    stopCreating() {
      this.startEventCreationRange = undefined;
      this.creatingEventRange = undefined;
      window.removeEventListener("mousemove", this.extendCreatingEvent);
      window.removeEventListener("mouseup", this.createEventFromRange);
      window.removeEventListener("keydown", this.stopCreatingKeyboardListener);
    },
    extendCreatingEvent(e: MouseEvent | TouchEvent) {
      const clientX =
        e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
      const range = this.rangeFromOffsetLeft(clientX) as OffsetRange;
      const creatingEventRange = [];
      creatingEventRange.push(
        range[0].left < this.startEventCreationRange![0].left
          ? range[0]
          : this.startEventCreationRange![0]
      );
      creatingEventRange.push(
        range[1].left > this.startEventCreationRange![1].left
          ? range[1]
          : this.startEventCreationRange![1]
      );
      this.creatingEventRange = creatingEventRange as OffsetRange;
    },
    createEventFromRange(e: MouseEvent | TouchEvent) {
      const rangeToCreate = this.creatingEventRange
        ? this.creatingEventRange
        : this.startEventCreationRange;
      this.$store.dispatch("createEventFromRange", rangeToCreate);
      this.stopCreating();
    },
    moveListener(e: MouseEvent) {
      this.mouseLeft = e.clientX;
    },
    touchScreenListener() {
      const vm = this;
      const touchListener = (e: TouchEvent) => {
        if (!vm.mc) {
          vm.setupHammer();
          vm.$el.removeEventListener(
            "touchstart",
            touchListener as EventListener
          );
        }
      };
      this.$el.addEventListener("touchstart", touchListener as EventListener);
    },
    setNewMarkers(newMarkers: TimeMarker[]) {
      if (!newMarkers) {
        this.markers = [];
      }

      if (this.markers.length === 0) {
        this.markers = newMarkers;
        return;
      }

      let oldMarkersIndex = 0;

      for (const newMarker of newMarkers) {
        let nextOld = this.markers[oldMarkersIndex];

        // This new marker is later than the next earliest that we already have.
        // Remove everything before it.
        let removed = false;
        while (!!nextOld && newMarker.dateTime > nextOld.dateTime) {
          removed = true;
          this.markers.splice(oldMarkersIndex, 1);
          nextOld = this.markers[oldMarkersIndex];
        }

        if (!nextOld) {
          this.markers.push(newMarker);
          continue;
        }

        if (newMarker.dateTime < nextOld.dateTime) {
          // This is earlier than the earliest that we already have.
          // We can insert it and incrememnt our oldMarkerIndex by one
          // since we will have shifted all other elements to the right.
          this.markers.splice(oldMarkersIndex, 0, newMarker);
          oldMarkersIndex++;
        } else if (+newMarker.dateTime === +nextOld.dateTime) {
          // This is the same marker. Just update it's visual stuff.
          nextOld.size = newMarker.size;
          nextOld.left = newMarker.left;
          oldMarkersIndex++;
        } else if (removed) {
          this.markers.splice(oldMarkersIndex, 0, newMarker);
          oldMarkersIndex++;
        }
      }

      // Remove all the others
      if (oldMarkersIndex < this.markers.length - 1) {
        this.markers.splice(oldMarkersIndex);
      }
    },
    throttledSetViewportDateInterval() {},
    getViewport() {
      const el = this.$el as HTMLElement;
      return {
        left: el.scrollLeft - el.offsetLeft,
        width: el.clientWidth + el.offsetLeft,
        top: el.scrollTop,
      };
    },
    setViewportDateInterval() {
      this.$store.dispatch("setViewport", this.getViewport());
    },
    handleResize() {
      this.setViewportDateInterval();
    },
    scroll() {
      this.setViewportDateInterval();
    },
    setupHammer() {
      this.$el.addEventListener("touchstart", this.touchStart);
      this.$el.addEventListener("touchend", this.touchEnd);
      this.mc = new Hammer.Manager(this.$el);
      this.mc.add(new Hammer.Pinch({ touchAction: "none" }));
      this.mc.on("pinch", this.pinch);
      this.mc.on("pinchend", this.pinchEnd);
    },
    setupZoomer() {
      const gestures = {
        startGesture: this.startGesture,
        doGesture: this.doGesture,
      };
      this.endGesture = zoomer(this.$el as HTMLElement, gestures);
    },
    startGesture(wg: WheelGesture) {
      if (!this.startingZoom) {
        this.startingZoom = this.$store.getters.settings.scale;
        this.pinchStartScrollTop = this.$el.scrollTop;
        this.pinchStartScrollLeft = this.$el.scrollLeft;
        this.pinchStartCenterX =
          wg.origin.x - (this.$el as HTMLElement).offsetLeft;
        this.pinchStartCenterY = wg.origin.y;
      }
    },
    doGesture(wg: WheelGesture) {
      if (this.startingZoom! * wg.scale > MAX_SCALE) {
        return;
      }

      const offsetLeft = (this.$el as HTMLElement).offsetLeft;
      const newScrollLeft =
        wg.scale * (this.pinchStartScrollLeft! + this.pinchStartCenterX!) -
        (wg.origin.x! - offsetLeft);
      const newScrollTop =
        this.pinchStartScrollTop! + this.pinchStartCenterY! - wg.origin.y;

      this.$el.scrollLeft = newScrollLeft;
      this.$el.scrollTop = newScrollTop;

      this.setScale(this.startingZoom! * wg.scale);
      this.throttledSetViewportDateInterval();

      this.startingZoom = null;
      // this.pinchStartScrollLeft = null;
      this.pinchStartScrollTop = null;
      this.pinchStartCenterX = null;
      this.pinchStartCenterY = null;

      this.endGesture();
    },
    endGesture() {},
    setScale(scale: number) {
      this.$store.commit("setScale", scale);
    },
    pinch(e: any) {
      e.preventDefault();
      const offsetLeft = (this.$el as HTMLElement).offsetLeft;

      if (!this.startingZoom) {
        this.startingZoom = this.$store.getters.settings.scale;
        this.pinchStartScrollTop = this.$el.scrollTop;
        this.pinchStartScrollLeft = this.$el.scrollLeft - offsetLeft;
        this.pinchStartCenterX = e.center.x;
        this.pinchStartCenterY = e.center.y;
      }

      const newScrollTop =
        this.pinchStartScrollTop! + this.pinchStartCenterY! - e.center.y;
      let scale = e.scale;
      if (this.startingZoom! * scale > MAX_SCALE) {
        scale = 1;
      }
      const newScrollLeft =
        scale * (this.pinchStartScrollLeft! + this.pinchStartCenterX!) -
        (e.center.x! - offsetLeft);

      this.$el.scrollLeft = newScrollLeft;
      this.$el.scrollTop = newScrollTop;

      if (scale !== 1) {
        this.setScale(this.startingZoom! * e.scale);
      }

      this.throttledSetViewportDateInterval();
    },
    pinchEnd(e: any) {
      e.preventDefault();
      this.startingZoom = null;
      this.pinchStartScrollLeft = null;
      this.pinchStartScrollTop = null;
      this.pinchStartCenterX = null;
      this.pinchStartCenterY = null;
    },
    touchStart(e: Event) {
      const event = e as TouchEvent;
      if (event.touches.length >= 2) {
        this.mc.get("pinch").set({ enable: true });
        e.preventDefault();
      }
    },
    touchEnd(e: any) {
      const event = e as TouchEvent;
      if (event.touches.length < 2) {
        this.mc.get("pinch").set({ enable: false });
      }
    },
    panStart(e: MouseEvent) {
      if (this.panStartX === null) {
        this.panStartScrollLeft = this.$el.scrollLeft;
        this.panStartScrollTop = this.$el.scrollTop;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
      }
      window.addEventListener("mousemove", this.panning);
      window.addEventListener("mouseup", this.endPanning);
    },
    panning(e: MouseEvent) {
      e.preventDefault();
      this.$el.scrollLeft =
        this.panStartScrollLeft! + this.panStartX! - e.clientX;
      this.$el.scrollTop =
        this.panStartScrollTop! + this.panStartY! - e.clientY;
    },
    endPanning(e: MouseEvent) {
      e.preventDefault();
      this.panStartX = null;
      this.panStartY = null;
      window.removeEventListener("mousemove", this.panning);
      window.removeEventListener("mouseup", this.endPanning);
      return false;
    },
  },
});
</script>

<style>
#timeline::-webkit-scrollbar {
  display: none;
}
</style>