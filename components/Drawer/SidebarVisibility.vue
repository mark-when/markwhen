<template>
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
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
  },
});
</script>

<style>
</style>