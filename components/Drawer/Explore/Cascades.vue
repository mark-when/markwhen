<template>
  <div>
    <explore-cascade
      v-for="cascade in cascades"
      :key="cascade.filePath"
      :cascade="cascade"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ExploreCascade from "./ExploreCascade.vue";

export default Vue.extend({
  components: { ExploreCascade },
  props: ["cascades"],
});
</script>

<style>
</style>