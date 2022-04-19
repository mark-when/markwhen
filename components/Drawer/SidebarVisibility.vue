<template>
  <div class="md:flex flex-col md:mb-auto items-center justify-center hidden">
    <button
      role="button"
      title="Close/collapse sidebar"
      @click="close"
      class="
        hover:bg-gray-300 hover:text-gray-800
        transition
        p-2
        md:mt-2
        text-gray-400
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
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
      role="button"
      title="Switch sidebar side"
      class="
        hover:bg-gray-300 hover:text-gray-800
        transition
        p-2
        mt-2
        text-gray-400
        hidden
        md:block
      "
      @click="switchSides"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
        />
      </svg>
    </button>
    <button
      role="button"
      title="Toggle dark mode"
      class="
        hover:bg-gray-300 hover:text-gray-800
        transition
        p-2
        mt-2
        text-gray-400
        hidden
        md:block
      "
      @click="toggleDarkMode"
    >
      <svg
        v-if="darkMode === 'light'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-if="darkMode === 'dark'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>
      <svg
        v-if="darkMode === 'system'"
        class="h-4 w-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M10.85 12.65h2.3L12 9l-1.15 3.65zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9h-1.9z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  computed: mapState({ darkMode: (state) => (state as any).sidebar.darkMode }),
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
      this.$cookies.set('sbs', this.$store.state.sidebar.position)
    },
    toggleDarkMode() {
      this.$store.commit("sidebar/toggleDarkMode");
      this.$cookies.set("theme", this.$store.getters["sidebar/darkMode"]);
    },
  },
});
</script>

<style>
</style>