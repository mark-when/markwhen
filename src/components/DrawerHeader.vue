<template>
  <div class="flex flex-row pb-2">
    <div class="underline flex items-end">
      <a href="https://github.com/kochrt/cascade.page" target="_blank"
        >GitHub</a
      >
    </div>
    <display-settings></display-settings>
    <tags></tags>
    <button
      class="ml-auto hover:bg-gray-500 rounded px-3 flex flex-row items-center"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="hidden md:block">{{ modelValue ? "Expand" : "Collapse" }}</span
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-if="!modelValue"
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
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-if="modelValue"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
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
  props: ["modelValue"],
};
</script>

<style>
</style>