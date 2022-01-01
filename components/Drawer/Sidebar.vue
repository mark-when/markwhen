<template>
  <div
    class="
      h-full
      overflow-y-auto overflow-x-hidden
      flex-shrink-0
      hover:bg-gray-800
      flex flex-row
      border-r border-gray-600
      z-10
    "
    :class="{
      'bg-gray-800': selectedComponent,
      'order-2': !isLeft,
    }"
    style="-webkit-transform: translate3d(0, 0, 0)"
  >
    <div class="flex flex-col justify-end mb-4" :class="{ 'order-2': !isLeft }">
      <div class="flex mb-auto items-center flex-col">
        <button
          @click="close"
          class="
            hover:bg-gray-300 hover:text-gray-800
            transition
            p-2
            mt-2
            text-gray-400
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          class="
            hover:bg-gray-300 hover:text-gray-800
            transition
            p-2
            mt-2
            text-gray-400
          "
          @click="switchSides"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
            />
          </svg>
        </button>
      </div>
      <button
        class="p-2 hover:bg-gray-900"
        :class="selectedComponent === 'editor' ? 'bg-gray-900' : ''"
        @click="selectEdit"
      >
        <svg
          class="h-6 w-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          ></path>
        </svg>
      </button>
      <button
        class="p-2 hover:bg-gray-900"
        :class="selectedComponent === 'profile' ? 'bg-gray-900' : ''"
        @click="selectProfile"
      >
        <svg
          class="h-6 w-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          ></path>
        </svg>
      </button>
      <div class="my-2 flex-col flex items-center">
        <a
          href="https://github.com/kochrt/cascade.page"
          class="p-2"
          target="_blank"
          ><svg
            height="32"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            class="h-5 w-5"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path></svg
        ></a>
        <a href="/" class="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
        </a>
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
        class="
          bg-transparent
          w-2
          hover:bg-gray-700
          absolute
          right-0
          bottom-0
          top-0
        "
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

export default Vue.extend({
  components: { TimelineEditor },
  computed: {
    ...mapState({
      selectedComponent: (state: any) =>
        state.sidebar.selectedComponent as string,
      isLeft: (state: any) => state.sidebar.position === "left",
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
    close() {
      if (this.$store.state.sidebar.selectedComponent) {
        this.$store.commit("sidebar/setSelectedComponent", "");
      } else {
        this.$store.commit("sidebar/toggle");
      }
    },
    switchSides() {
      this.$store.commit("sidebar/togglePosition");
    },
    selectEdit() {
      this.$store.commit("sidebar/setSelectedComponent", "editor");
    },
    selectProfile() {
      this.$store.commit("sidebar/setSelectedComponent", "profile");
    },
    selectViewOptions() {
      this.$store.commit("sidebar/setSelectedComponent", "viewOptions");
    },
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
          this.tempWidth = this.width + this.resizeStartX - e.pageX
        }
      }
    },
  },
});
</script>

<style>
</style>