<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Types";
import { computed } from "@vue/reactivity";
import { watch } from "vue";
import EventGroup from "./Group/EventGroup.vue";
import EventSection from "./Section/EventSection.vue";

const props = defineProps<{ group: EventSubGroup }>();

watch(computed(() => props.group), console.log);
</script>

<template>
  <event-group v-if="group.style === 'group'" :eventGroup="group" />
  <event-section v-else :eventGroup="group" />
</template>

<style scoped></style>
