<template>
  <article class="prose mx-auto px-2" style="margin-top: 3rem;">
    <nuxt-content :document="page" />
    <div class="h-36"></div>
  </article>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  async asyncData({ $content }) {
    const page = await $content("docs").fetch();
    return {
      page,
    };
  },
});
</script>

<style>
</style>