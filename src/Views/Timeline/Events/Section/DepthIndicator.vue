<script setup lang="ts">
import { computed } from "@vue/reactivity";

const props = defineProps<{ depth: number }>();
const numEven = computed(() => Math.floor((props.depth - 1) / 2));
const isOdd = computed(() => (props.depth - 1) % 2 === 1);
</script>

<template>
  <div class="mr-[2px] flex flex-row items-center" v-if="depth > 1">
    <svg
      v-for="i in numEven"
      xmlns="http://www.w3.org/2000/svg"
      class="w-1 h-2"
      width="40"
      height="40"
      viewBox="0 0 16 20"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="8" cy="4" r="4" fill="currentColor"></circle>
      <circle cx="8" cy="18" r="4" fill="currentColor"></circle>
    </svg>
    <svg
      v-if="isOdd"
      xmlns="http://www.w3.org/2000/svg"
      class="w-1 h-2"
      width="40"
      height="40"
      viewBox="0 0 16 20"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="8" cy="11" r="4" fill="currentColor"></circle>
    </svg>
  </div>
</template>

<style scoped></style>
