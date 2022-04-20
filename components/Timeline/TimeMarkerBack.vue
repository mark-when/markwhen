<template>
  <div class="h-full flex-shrink-0" :style="columnStyle"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["opacity", "width", "borderColor"],
  computed: {
    columnStyle(): string {
      return `width: ${this.width}px; border-left: 1px dashed ${this.borderColor};`;
    },
  },
});
</script>

<style>
</style>