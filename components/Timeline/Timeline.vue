<template>
  <div
    class="relative h-full overflow-auto w-full"
    @mousedown="panStart"
    :style="eventsStyle"
  >
    <events
      :years="years"
      :columnWidth="columnWidth"
    />
    <drawer-header :edittable="edittable" />
  </div>
</template>

<script lang="ts">
import { BoundingYears } from "../../Types";
import Events from "./Events.vue";
import Vue from "vue";
import Years from "./Years.vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
import Hammer from "@squadette/hammerjs";

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
      startingScrollLeft: null as number | null,
      startingScrollTop: null as number | null,
      startingZoom: null as number | null,
      startScrollLeft: null as number | null,
      centerOffsetLeft: null as number | null,
    };
  },
  mounted() {
    this.setupHammer();
  },
  methods: {
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
        this.startingZoom = this.$store.state.settings.yearWidth;
        this.startScrollLeft = this.$el.scrollLeft;
        this.centerOffsetLeft = e.center.x;
      }
      this.$el.scrollLeft =
        e.scale * (this.startScrollLeft! + this.centerOffsetLeft!) -
        e.center.x!;
      this.$store.commit("setYearWidth", this.startingZoom! * e.scale);
    },
    pinchEnd(e: any) {
      e.preventDefault();
      this.startingZoom = null;
      this.startScrollLeft = null;
      this.centerOffsetLeft = null;
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
        this.startingScrollLeft = this.$el.scrollLeft;
        this.startingScrollTop = this.$el.scrollTop;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
      }
      window.addEventListener("mousemove", this.panning);
      window.addEventListener("mouseup", this.endPanning);
    },
    panning(e: MouseEvent) {
      e.preventDefault();
      this.$el.scrollLeft =
        this.startingScrollLeft! + this.panStartX! - e.clientX;
      this.$el.scrollTop =
        this.startingScrollTop! + this.panStartY! - e.clientY;
    },
    endPanning(e: MouseEvent) {
      this.panStartX = null;
      this.panStartY = null;
      window.removeEventListener("mousemove", this.panning);
      window.removeEventListener("mouseup", this.endPanning);
    },
  },
  computed: {
    eventsStyle(): string {
      return `cursor: ${this.panStartX ? "grabbing" : "grab"};`;
    },
    columnWidth(): number {
      return this.$store.state.settings.yearWidth;
    },
    years(): BoundingYears {
      const events = this.$store.getters.events;

      if (!events || events.length === 0) {
        return { start: 2010, end: 2020 };
      }

      let min = events[0].startingYear();
      let max = events[0].getNextYear();
      for (let event of events) {
        if (event.startingYear() < min) {
          min = event.startingYear();
        }
        if (event.getNextYear() > max) {
          max = event.getNextYear();
        }
      }
      return {
        start: min - 1,
        end: max + 2 + Math.floor(5 * (100 / this.columnWidth)),
      };
    },
    numColumns(): number {
      return this.years.end - this.years.start;
    },
  },
});
</script>

<style>
</style>