<template>
  <div class="flex flex-col mb-2">
    <h3>Year width</h3>
    <input type="range" min="10" max="1600" v-model="width" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: this.$store.state.settings.yearWidth,
    };
  },
  watch: {
    width(val, oldVal) {
      this.$store.commit("setYearWidth", val);
    },
  },
};
</script>

<style>
</style>