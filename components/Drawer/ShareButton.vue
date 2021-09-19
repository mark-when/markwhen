<template>
  <button
    class="
      flex flex-row
      items-center
      px-2
      bg-blue-800
      rounded
      transition-all
      duration-100
      text-gray-200
      hover:bg-blue-700
      hover:text-gray-50
      disabled:text-gray-400
      disabled:bg-blue-900
      disabled:cursor-default
      mr-2
    "
    :disabled="disabled"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    {{ buttonTitle }}
  </button>
</template>

<script lang="ts">
export default {
  props: ["disabled", "buttonTitle"]
};
</script>

<style>
</style>