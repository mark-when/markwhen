<template>
  <div
    class="
      md:h-full
      overflow-y-auto overflow-x-hidden
      flex-shrink-0
      hover:bg-gray-800
      flex flex-col
      md:flex-row
      border-gray-600
      z-10
      order-2
    "
    :class="{
      'bg-gray-800': selectedComponent,
      'md:order-2': !isLeft,
      'md:order-1': isLeft,
      'md:border-l': !isLeft,
      'md:border-r': isLeft,
    }"
    style="-webkit-transform: translate3d(0, 0, 0)"
  >
    <div
      class="
        flex flex-row
        md:flex-col
        justify-center
        md:justify-end md:mb-4
        order-2
      "
      :class="{ 'md:order-2': !isLeft, 'md:order-1': !isLeft }"
    >
      <sidebar-visibility />
      <div class="flex flex-row md:flex-col items-center">
        <sidebar-component-selector />
        <sidebar-links />
      </div>
    </div>
    <div class="relative order-1 md:hidden">
      <keep-alive>
        <component :is="selectedComponentComponent" />
      </keep-alive>
    </div>
    <div
      v-show="selectedComponent"
      class="relative order-1 hidden md:block"
      :class="{ 'md:order-1': !isLeft, 'md:order-2': isLeft }"
      :style="`width: ${tempWidth ? tempWidth : width}px;`"
    >
      <keep-alive>
        <component :is="selectedComponentComponent" />
      </keep-alive>
      <div
        class="bg-transparent w-2 hover:bg-gray-700 absolute bottom-0 top-0"
        :class="{
          'right-0': isLeft,
          'left-0': !isLeft,
        }"
        @mousedown.prevent="resizeMouseDown"
        @touchstart.prevent="resizeMouseDown"
        style="cursor: ew-resize"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineEditor from "./TimelineEditor.vue";
import Profile from "./Profile/Profile.vue";
import { mapState } from "vuex";
import SidebarComponentSelector from "./SidebarComponentSelector.vue";
import SidebarLinks from "./SidebarLinks.vue";
import SidebarVisibility from "./SidebarVisibility.vue";

export default Vue.extend({
  components: {
    TimelineEditor,
    SidebarComponentSelector,
    SidebarLinks,
    SidebarVisibility,
  },
  computed: {
    ...mapState({
      selectedComponent: (state: any) =>
        state.sidebar.selectedComponent as string,
      isLeft: (state: any) => state.sidebar.position === "left",
      hasSeenHowTo: (state: any) => state.hasSeenHowTo,
    }),
    selectedComponentComponent(): any {
      if (this.selectedComponent === "editor") {
        return TimelineEditor;
      }
      return Profile;
    },
  },
  data() {
    return {
      width: 350,
      resizeStarted: false,
      resizeStartX: 0,
      tempWidth: 0,
    };
  },
  methods: {
    resizeMouseDown(e: MouseEvent) {
      this.resizeStarted = true;
      this.resizeStartX = e.pageX;
      document.addEventListener("mousemove", this.resizeMouseMove);
      document.addEventListener("mouseup", this.resizeMouseUp);
      document.addEventListener(
        "touchmove",
        this.resizeMouseMove as EventListener
      );
      document.addEventListener(
        "touchend",
        this.resizeMouseUp as EventListener
      );
    },
    resizeMouseUp(e: MouseEvent | TouchEvent) {
      this.resizeStarted = false;
      if (this.tempWidth) {
        this.width = Math.max(this.tempWidth, 50);
        this.tempWidth = 0;
      }
      document.removeEventListener("mouseup", this.resizeMouseUp);
      document.removeEventListener("mousemove", this.resizeMouseMove);
    },
    resizeMouseMove(e: MouseEvent) {
      if (this.resizeStarted) {
        if (this.isLeft) {
          this.tempWidth = this.width - this.resizeStartX + e.pageX;
        } else {
          this.tempWidth = this.width + this.resizeStartX - e.pageX;
        }
      }
    },
  },
});
</script>

<style>
</style>