<template>
  <div class="flex flex-col order-2 md:order-1 md:mr-4">
    <Storage />
    <sign-in />
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";
import SignIn from "./SignIn.vue"

export default {
  components: { Storage, SignIn },
};
</script>

<style>
</style>