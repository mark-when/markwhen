<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import EventGroup from "./Group/EventGroup.vue";
import EventSection from "./Section/EventSection.vue";

const props = defineProps<{ group: EventSubGroup }>();
</script>

<template>
  <event-group v-if="group.style === 'group'" :eventGroup="group" />
  <event-section v-else :eventGroup="group" />
</template>

<style scoped></style>
