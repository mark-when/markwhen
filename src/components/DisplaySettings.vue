<template>
  <div class="flex flex-col mx-2">
    <input type="range" min="10" max="1600" v-model="width" class="my-1"/>
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