<script setup lang="ts">
import { useNewEventStore } from "./newEventStore";
import NewEventDialog from "./NewEventDialog.vue";

const newEventStore = useNewEventStore();

const newEvent = () => newEventStore.prompt();
</script>

<template>
  <button
    @click="newEvent"
    class="h-6 flex flex-row items-center rounded hover:bg-zinc-200 transition dark:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 px-1 text-sm lg:text-base font-bold"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="4 4 12 12"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
      ></path>
    </svg>
  </button>
  <NewEventDialog></NewEventDialog>
</template>

<style scoped></style>
