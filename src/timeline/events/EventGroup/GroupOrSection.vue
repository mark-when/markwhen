<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import EventGroup from "./Group/EventGroup.vue";
import EventSection from "./Section/EventSection.vue";

const props = defineProps<{ group: EventSubGroup }>();
</script>

<template>
  <event-group
    v-if="group.style === 'group'"
    :key="group.length ? group[0].eventString.substring(0, 50) : 'newGroup'"
    :eventGroup="group"
  />
  <event-section
    v-else
    :key="group.length ? group[0].eventString.substring(0, 50) : 'newSection'"
    :eventGroup="group"
  />
</template>

<style scoped></style>
