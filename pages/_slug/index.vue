<template>
  <Main :edittable="false" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";

export default Vue.extend({
  head() {
    return {
      title: `${this.$store.state.timelinePath} - Cascade`,
    };
  },
  components: { Main },
});
</script>
