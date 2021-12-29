<template>
  <div class="flex flex-row p-2 mx-2 my-2 bg-gray-900">
    <a href="/" class="ml-2 mr-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
        />
      </svg>
    </a>
    <a
      :href="'/' + $store.state.timelinePath"
      class="mr-4 flex items-center text-gray-300"
      v-if="$store.state.timelinePath"
    >
      @{{ $store.state.timelinePath }}
    </a>
    <display-settings></display-settings>
    <tags></tags>
    <button
      v-if="collapsible"
      class="ml-auto hover:bg-gray-500 rounded px-3 flex flex-row items-center"
      @click="$emit('input', !value)"
    >
      <span class="hidden md:block">{{ value ? "Expand" : "Collapse" }}</span
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-if="!value"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-if="value"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
    <a v-else href="/" class="ml-auto underline text-gray-300 hidden md:block flex-shrink-0 pl-2"
      >Make your own cascade</a
    >
  </div>
</template>

<script>
import Tags from "./Tags.vue";
import DisplaySettings from "./DisplaySettings.vue";
export default {
  components: {
    Tags,
    DisplaySettings,
  },
  props: ["value", "collapsible", "timelinePath"],
};
</script>

<style>
</style>