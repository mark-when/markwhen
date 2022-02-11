<template>
  <div
    id="timeline"
    class="relative h-full overflow-auto w-full"
    :class="{ 'order-1': $store.state.sidebar.position === 'right' }"
    @mousedown.prevent="panStart"
    @scroll="scroll"
    :style="eventsStyle"
  >
    <!-- @mousewheel.prevent="resize" -->
    <events />
    <drawer-header :edittable="edittable" />
  </div>
</template>

<script lang="ts">
import Events from "./Events.vue";
import Vue from "vue";
import Years from "./Years.vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
// @ts-ignore
import Hammer from "@squadette/hammerjs";
import { mapState } from "vuex";
/*
 * If a user doesn't specify a color, use one from our colors array and use our color classes.
 * If a user specifies a color from the color array, use our color classes.
 */

export default Vue.extend({
  components: { Events, Years, DrawerHeader },
  props: ["edittable"],
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
    };
  },
  mounted() {
    this.setupHammer();
    this.setViewportDateInterval();
  },
  watch: {
    startedWidthChange(val) {
      this.widthChangeStartScrollLeft = val ? this.$el.scrollLeft : null;
      this.widthChangeStartYearWidth = this.scale;
    },
    scale(val, oldVal) {
      if (!this.startedWidthChange) {
        return;
      }
      const startCenter =
        this.widthChangeStartScrollLeft! + this.$el.clientWidth / 2;
      const scale = val / this.widthChangeStartYearWidth!;
      this.$el.scrollLeft = scale * startCenter - this.$el.clientWidth / 2!;
    },
  },
  computed: {
    ...mapState({
      scale: (state: any) => state.settings.scale,
      startedWidthChange: (state: any) => state.settings.startedWidthChange,
    }),
    eventsStyle(): string {
      return `cursor: ${this.panStartX ? "grabbing" : "grab"};`;
    },
  },
  methods: {
    setViewportDateInterval() {
      this.$store.commit(
        "setViewportDateInterval",
        this.$store.getters.setDateIntervalFromViewport(
          this.$el.scrollLeft,
          this.$el.clientWidth
        )
      );
    },
    scroll() {
      this.setViewportDateInterval();
    },
    // resize() {
    //   console.log('resize')
    // },
    setupHammer() {
      this.$el.addEventListener("touchstart", this.touchStart);
      this.$el.addEventListener("touchend", this.touchEnd);
      this.mc = new Hammer.Manager(this.$el);
      this.mc.add(new Hammer.Pinch({ touchAction: "none" }));
      this.mc.on("pinch", this.pinch);
      this.mc.on("pinchend", this.pinchEnd);
    },
    pinch(e: any) {
      e.preventDefault();
      if (!this.startingZoom) {
        this.startingZoom = this.$store.state.settings.scale;
        this.pinchStartScrollTop = this.$el.scrollTop;
        this.pinchStartScrollLeft = this.$el.scrollLeft;
        this.pinchStartCenterX = e.center.x;
        this.pinchStartCenterY = e.center.y;
      }
      this.$el.scrollLeft =
        e.scale * (this.pinchStartScrollLeft! + this.pinchStartCenterX!) -
        e.center.x!;
      this.$el.scrollTop =
        this.pinchStartScrollTop! + this.pinchStartCenterY! - e.center.y;
      this.$store.commit("setScale", this.startingZoom! * e.scale);
    },
    pinchEnd(e: any) {
      e.preventDefault();
      this.startingZoom = null;
      this.pinchStartScrollLeft = null;
      this.pinchStartScrollTop = null;
      this.pinchStartCenterX = null;
      this.pinchStartCenterY = null;
    },
    touchStart(e: any) {
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