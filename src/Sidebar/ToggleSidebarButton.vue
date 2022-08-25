<script setup lang="ts">
import { useSidebarStore } from "./sidebarStore";

const sidebarStore = useSidebarStore();

const toggleSidebar = () => sidebarStore.toggle();
</script>

<template>
  <button
    role="button"
    title="Toggle sidebar"
    class="print-hidden transition hidden md:flex flex-col items-center text-gray-500 dark:text-gray-300"
    @click="toggleSidebar"
  >
    <template v-if="sidebarStore.isLeft">
      <svg
        v-if="!sidebarStore.visible"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 md:m-1"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="20" y1="12" x2="10" y2="12"></line>
        <line x1="20" y1="12" x2="16" y2="16"></line>
        <line x1="20" y1="12" x2="16" y2="8"></line>
        <line x1="4" y1="4" x2="4" y2="20"></line>
      </svg>
      <svg
        v-if="sidebarStore.visible"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 md:m-1"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="10" y1="12" x2="20" y2="12"></line>
        <line x1="10" y1="12" x2="14" y2="16"></line>
        <line x1="10" y1="12" x2="14" y2="8"></line>
        <line x1="4" y1="4" x2="4" y2="20"></line>
      </svg>
    </template>
    <template v-else>
      <svg
        v-if="sidebarStore.visible"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 md:m-1"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="14" y1="12" x2="4" y2="12"></line>
        <line x1="14" y1="12" x2="10" y2="16"></line>
        <line x1="14" y1="12" x2="10" y2="8"></line>
        <line x1="20" y1="4" x2="20" y2="20"></line>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 md:m-1"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="4" y1="12" x2="14" y2="12"></line>
        <line x1="4" y1="12" x2="8" y2="16"></line>
        <line x1="4" y1="12" x2="8" y2="8"></line>
        <line x1="20" y1="4" x2="20" y2="20"></line>
      </svg>
    </template>
  </button>
</template>

<style scoped></style>
