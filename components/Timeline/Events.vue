<template>
  <div
    id="events"
    class="flex flex-col relative"
    @mousedown="panStart"
    :style="eventsStyle"
  >
    <years :years="years" :columnWidth="columnWidth" />
    <div class="h-24"></div>
    <!-- <transition-group
      :name="transitionName"
    > -->
    <event-row
      v-for="event in $store.getters.filteredEvents"
      :key="event.eventString.substring(0, 30)"
      :event="event"
      :widthPerDay="widthPerDay"
      :startYear="years.start"
      :columnWidth="columnWidth"
    ></event-row>
    <!-- </transition-group> -->
    <div style="height: 50vh"></div>
  </div>
</template>

<script lang="ts">
import EventRow from "./EventRow.vue";
import Years from "./Years.vue";
import Vue from "vue";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
import Hammer from "@squadette/hammerjs";

export default Vue.extend({
  components: { EventRow, Years, DrawerHeader },
  props: ["years", "columnWidth"],
  computed: {
    widthPerDay(): number {
      return this.columnWidth / 12 / 30;
    },
    transitionName(): string {
      return "eventRow";
    },
    eventsStyle(): string {
      return `cursor: ${this.panStartX ? "grabbing" : "grab"};`;
    },
  },
  data() {
    return {
      mc: null as any,
      panStartX: null as number | null,
      panStartY: null as number | null,
      startingScrollLeft: null as number | null,
      startingScrollTop: null as number | null,
      startingZoom: null as number | null,
    };
  },
  mounted() {
    this.$el.addEventListener("touchstart", this.touchStart);
    this.$el.addEventListener("touchend", this.touchEnd);
    // if two finger touch event, activate our pinch/pan handlers,
    // otherwise deactivate
    this.mc = new Hammer.Manager(this.$el);
    this.mc.add(new Hammer.Pinch({ touchAction: "none" }));
    this.mc.on("pinch", (e: any) => {
      e.preventDefault();
      if (!this.startingZoom) {
        this.startingZoom = this.$store.state.settings.yearWidth;
      }
      // console.log(e.scale);
      this.$store.commit("setYearWidth", this.startingZoom! * e.scale);
    });
    this.mc.on("pinchend", (e) => {
      e.preventDefault();
      this.startingZoom = null;
    });
    // this.mc.on("pinchmove", (e) => {
    //   e.preventDefault();
    //   console.log("pinch move");
    // });
    // this.mc.on("pinchcancel", (e) => {
    //   e.preventDefault();
    //   console.log("pinch cancel");
    // });
    // this.mc.on("pinchin", (e) => {
    //   e.preventDefault();
    //   console.log("pinch in");
    // });
    // this.mc.on("pinchout", (e) => {
    //   e.preventDefault();
    //   console.log("pinch out");
    // });
  },
  methods: {
    touchStart(e: any) {
      const event = e as TouchEvent;
      if (event.touches.length >= 2) {
        this.mc.get("pinch").set({ enable: true });
        e.preventDefault()
      }
    },
    touchEnd(e: any) {
      const event = e as TouchEvent;
      if (event.touches.length < 2) {
        this.mc.get("pinch").set({ enable: false });
        e.preventDefault()
      }
    },
    panStart(e: MouseEvent) {
      if (this.panStartX === null) {
        this.startingScrollLeft = this.$el.parentElement!.scrollLeft;
        this.startingScrollTop = this.$el.parentElement!.scrollTop;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
      }
      window.addEventListener("mousemove", this.panning);
      window.addEventListener("mouseup", this.endPanning);
    },
    panning(e: MouseEvent) {
      e.preventDefault();
      this.$el.parentElement!.scrollLeft =
        this.startingScrollLeft! + this.panStartX! - e.clientX;
      this.$el.parentElement!.scrollTop =
        this.startingScrollTop! + this.panStartY! - e.clientY;
    },
    endPanning(e: MouseEvent) {
      this.panStartX = null;
      this.panStartY = null;
      window.removeEventListener("mousemove", this.panning);
      window.removeEventListener("mouseup", this.endPanning);
    },
  },
});
</script>

<style>
/* .company {
  backface-visibility: hidden;
  z-index: 1;
} */

/* moving */
/* .eventRow-move {
  transition: all 600ms ease-in-out 50ms;
} */

/* appearing */
.eventRow-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.eventRow-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.eventRow-enter-from,
.eventRow-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.eventRow {
  margin-top: 5px;
}

.eventRow:hover .eventBar {
  @apply opacity-90 shadow-lg;
}

.eventRow:hover .photoBar {
  @apply opacity-90 shadow-lg;
}

.eventBar {
  border-radius: 5px;
  height: 10px;
  flex-shrink: 0;
}

.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
}

.eventDate {
  color: #93979a;
  font-family: system-ui;
  font-size: 80%;
  margin: 0px 0px 0px 8px;
  white-space: nowrap;
}

.eventTitle a {
  color: white;
}
</style>