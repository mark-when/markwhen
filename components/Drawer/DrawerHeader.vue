<template>
  <div
    class="
      sticky
      bottom-0
      md:bottom-6
      left-2
      md:left-4
      flex flex-row
      items-center
      md:ml-4
      z-20
    "
    @mousedown="mousedown"
  >
    <button
      role="button"
      title="Toggle sidebar"
      class="
        md:mr-2
        dark:text-gray-400 dark:hover:text-gray-300
        hover:bg-slate-100
        rounded
        md:rounded-full
        dark:hover:bg-gray-800
        backdrop-filter backdrop-blur
        transition
        flex flex-col
        items-center
        px-2
        md:px-0
      "
      @touchstart="touchStart"
      @click="toggleSidebar"
      v-if="edittable"
    >
      <svg
        v-if="$store.state.sidebar.visible"
        class="h-4 w-4 -mb-2 md:hidden"
        fill="currentColor"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="m7 14 5-5 5 5H7z"></path>
      </svg>
      <svg
        class="h-5 w-5 md:m-1"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
        ></path>
      </svg>
      <svg
        v-if="$store.state.sidebar.visible"
        class="h-4 w-4 -mt-2 md:hidden"
        focusable="false"
        fill="currentColor"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="m7 10 5 5 5-5H7z"></path>
      </svg>
    </button>
    <a
      href="/"
      class="rounded-full dark:hover:bg-gray-900 hover:bg-gray-100"
      v-else
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 m-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
        />
      </svg>
    </a>
    <div
      class="
        flex flex-row
        p-2
        md:backdrop-filter
        backdrop-blur
        overflow-x-scroll
      "
      style="width: fit-content"
    >
      <a
        :href="'/' + $store.state.timelinePath"
        class="mr-4 flex items-center text-gray-300"
        v-if="$store.state.timelinePath"
      >
        @{{ $store.state.timelinePath }}
      </a>
      <display-settings></display-settings>
      <sort></sort>
      <tags></tags>
    </div>
  </div>
</template>

<script lang="ts">
import Tags from "./Tags.vue";
import DisplaySettings from "./DisplaySettings.vue";
import Vue from "vue";
import Sort from "./Sort.vue";

export default Vue.extend({
  components: {
    Tags,
    DisplaySettings,
    Sort,
  },
  props: ["value", "timelinePath", "edittable"],
  methods: {
    toggleSidebar() {
      this.$store.commit("sidebar/toggle");
    },
    mousedown(e: MouseEvent) {
      e.stopPropagation();
    },
    touchStart(t: TouchEvent) {
      t.stopPropagation();
      t.preventDefault();
      this.$store.commit("sidebar/startResizeY", t.touches[0].pageY);
      document.addEventListener("touchmove", this.resizeYMove);
      document.addEventListener("touchend", this.resizeYEnd);
    },
    resizeYMove(t: TouchEvent) {
      t.stopImmediatePropagation();
      this.$store.commit("sidebar/resizeY", t.touches[0].pageY);
    },
    resizeYEnd(t: TouchEvent) {
      this.$store.commit("sidebar/endResizeY");
      document.removeEventListener("touchmove", this.resizeYMove);
      document.removeEventListener("touchend", this.resizeYEnd);
    },
  },
});
</script>

<style>
</style>