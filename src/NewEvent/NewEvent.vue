<script setup lang="ts">
import { useNewEventStore } from "./newEventStore";
import NewEventDialog from "./NewEventDialog.vue";
import SettingsButton from "@/Settings/SettingsButton.vue";

const newEventStore = useNewEventStore();

const newEvent = () => newEventStore.prompt();
</script>

<template>
  <SettingsButton @click="newEvent" :hoverHintTitle="'New event'">
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
  </SettingsButton>
  <NewEventDialog></NewEventDialog>
</template>

<style scoped></style>
