<template>
  <div class="flex flex-row md:flex-col items-center">
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
    <button
      class="p-2 md:mt-3 ml-3 md:ml-0"
      :class="selectedComponent === 'howto' ? 'bg-gray-900' : ''"
      @click="selectHowTo"
    >
      <svg
        class="h-6 w-6 rounded-full"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        :style="hasSeenHowTo ? '' : 'box-shadow: 0 0 8px 3px white'"
      >
        <path
          d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  computed: mapState({
    selectedComponent: (state: any) =>
      state.sidebar.selectedComponent as string,
    hasSeenHowTo: (state: any) => state.hasSeenHowTo,
  }),
  methods: {
    selectEdit() {
      this.$store.commit("sidebar/setSelectedComponent", "editor");
    },
    selectProfile() {
      this.$store.commit("sidebar/setSelectedComponent", "profile");
    },
    selectHowTo() {
      if (process.browser) {
        this.$store.commit("setHasSeenHowTo", true);
      }
      window.location.href = "https://github.com/kochrt/cascade.page#readme";
    },
  },
});
</script>

<style>
</style>