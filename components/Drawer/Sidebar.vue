<template>
  <div
    class="
      h-full
      overflow-y-auto overflow-x-hidden
      flex-shrink-0
      hover:bg-gray-800
      flex flex-row
      border-gray-600
      z-10
    "
    :class="{
      'bg-gray-800': selectedComponent,
      'order-2': !isLeft,
      'border-l': !isLeft,
      'border-r': isLeft,
    }"
    style="-webkit-transform: translate3d(0, 0, 0)"
  >
    <div class="flex flex-col justify-end mb-4" :class="{ 'order-2': !isLeft }">
      <sidebar-visibility />
      <div class="flex flex-col items-center">
        <sidebar-component-selector />
        <sidebar-links />
      </div>
    </div>
    <div
      v-show="selectedComponent"
      class="relative"
      :class="{ 'order-1': !isLeft }"
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