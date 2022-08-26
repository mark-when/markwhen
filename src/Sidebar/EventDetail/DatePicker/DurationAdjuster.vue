<script setup lang="ts">
import { computed } from "vue";
import { useEventDetailStore } from "../eventDetailStore";
import DateAdjuster from "./DateAdjuster.vue";
import MiniEventBar from "./MiniEventBar.vue";

const eventDetailStore = useEventDetailStore();

const ev = computed(() => eventDetailStore.detailEvent);
</script>

<template>
  <div class="flex flex-row">
    <MiniEventBar :event="ev" v-if="ev" />
  </div>
</template>

<style scoped></style>
