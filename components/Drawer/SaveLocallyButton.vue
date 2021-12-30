<template>
  <button
    class="
      flex flex-row
      items-center
      px-2
      bg-gray-800
      rounded
      transition-all
      duration-100
      text-gray-200
      hover:bg-gray-700
      hover:text-gray-50
    " 
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
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
    Save...
  </button>
</template>

<script>
export default {};
</script>

<style>
</style>