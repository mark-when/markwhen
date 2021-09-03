<template>
  <div>
    <Storage />
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";

export default {
  components: { Storage },
  data() {
    return {
      list: [] as string[],
      currentTimelineName: "",
    };
  },
};
</script>

<style>
</style>