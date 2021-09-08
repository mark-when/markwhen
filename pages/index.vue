<template>
  <Main :edittable="true" />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";

export default Vue.extend({
  head: {
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
    ],
  },
  components: { Main },
});
</script>
