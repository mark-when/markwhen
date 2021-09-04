<template>
  <textarea
    class="flex-grow p-2 font-mono text-sm w-full text-gray-300 bg-gray-900"
    name="eventsField"
    rows="12"
    wrap="off"
    v-model="$store.state.eventsString"
  ></textarea>
  <div class="mt-3 flex flex-row">
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
        class="h-4 w-4 mr-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
        />
      </svg>
      Save cascade
    </button>
    <a
      class="underline ml-auto"
      href="https://github.com/kochrt/cascade.page"
      target="_blank"
      >GitHub</a
    >
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