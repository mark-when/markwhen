<template>
  <div class="flex flex-col mr-3">
    <h3 class="text-xl border-b">My timelines</h3>
    <div class="" v-if="list && list.length > 0">
      <div
        :class="selected ? 'bg-blue-100': ''"
        class="cursor-pointer flex flex-row align-baseline mb-1 hover:bg-blue-100 rounded px-1 transition-color duration-100"
        v-for="item in list"
        :key="item"
        @click="$emit('selected', item)"
      >
        <div class="">
          {{ item }}
        </div>
        <div class="ml-auto mt-1">
          <svg
            @click="$emit('delete', item)"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 hover:text-red-500"
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
        </div>
      </div>
    </div>
    <div class="" v-else>
      <div class="">No saved timelines</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ["list"]
};
</script>

<style>
</style>