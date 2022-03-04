<template>
  <div class="flex flex-col flex-grow min-w-24 overflow-scroll">
    <h3 class="text-xl font-bold ml-1 text-gray-500">My cascades</h3>
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