<template>
  <div class="">
    <site-header />
    <article class="prose px-2 mx-auto" style="margin-top: 3rem">
      <nuxt-content :document="page" />
      <div class="h-36"></div>
    </article>
  </div>
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