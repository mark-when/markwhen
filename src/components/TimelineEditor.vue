<template>
  <textarea
    class="flex-grow p-2 font-mono text-sm w-full text-gray-300 bg-gray-900"
    name="eventsField"
    rows="12"
    wrap="off"
    v-model="$store.state.eventsString"
  ></textarea>
  <div class="mt-3">
    <button
      class="
        flex flex-row
        items-center
        px-2
        bg-blue-800
        rounded
        hover:bg-blue-700
        transition-all
        duration-100
        text-gray-200
        hover:text-gray-50
      "
      @click="save"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Save cascade
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    save() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.$store.state.currentTimelineName
      );
      if (timelineName) {
        this.$store.commit("saveTimeline", timelineName);
      }
    },
  },
};
</script>

<style>
</style>