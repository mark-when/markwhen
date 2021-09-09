<template>
  <div class="flex flex-col flex-grow min-w-24">
    <h3 class="border-b border-gray-500 text-gray-400">My cascades</h3>
    <local-timelines />
    <cloud-timelines />
  </div>
</template>

<script>
import CloudTimelines from "./CloudTimelines.vue";
import LocalTimelines from "./LocalTimelines.vue";
export default {
  components: { LocalTimelines, CloudTimelines },
};
</script>

<style>
</style>