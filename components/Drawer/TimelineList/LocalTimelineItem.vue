<template>
  <div
    class="
      cursor-pointer
      flex flex-row
      align-baseline
      mb-1
      rounded
      px-2
      py-1
      ml-1
      transition
      duration-100
      text-slate-900
      dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800
      hover:bg-slate-100
    "
    @click="$emit('selected', item)"
  >
    <div class="flex flex-row items-center">
      <svg
        @click.prevent.stop="$emit('deleteItem', item)"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-500 hover:text-red-500 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
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
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
};
</script>

<style>
</style>