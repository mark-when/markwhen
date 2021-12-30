<template>
  <div
    class="
      h-full
      overflow-y-auto overflow-x-hidden
      flex-shrink-0
      hover:bg-gray-800
      flex flex-row
      border-r border-gray-600
    "
    :class="selectedComponent ? 'bg-gray-800' : ''"
  >
    <div class="flex flex-col justify-end mb-4">
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
      <a href="/" class="p-2 my-2 hover:bg-gray-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
          />
        </svg>
      </a>
    </div>
    <div
      v-show="selectedComponent"
      class="relative"
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
        @mousedown.prevent="resizeMouseDown"
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
    },
    resizeMouseUp(e: MouseEvent) {
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
        this.tempWidth = this.width - this.resizeStartX + e.pageX;
      }
    },
  },
});
</script>

<style>
</style>