<template>
  <div class="flex flex-col mx-2">
    <input type="range" min="0" max="100" v-model="width" class="my-1"/>
  </div>
</template>

<script>
export default {
  data() {
    let minSelection = 0
    let maxSelection = 100
    let minWidth = Math.log(10)
    let maxWidth = Math.log(1600)
    const scale = (maxWidth - minWidth) / (maxSelection - minSelection)
    const initialPosition = (Math.log(this.$store.state.settings.yearWidth)-minWidth) / scale + minSelection;
    return {
      width: initialPosition,
    };
  },
  watch: {
    width(val, oldVal) {
      let minSelection = 0
      let maxSelection = 100
      let minWidth = Math.log(10)
      let maxWidth = Math.log(1600)
      const scale = (maxWidth - minWidth) / (maxSelection - minSelection)
      this.$store.commit("setYearWidth", Math.exp(minWidth + scale * (val - minSelection)));
    },
  },
};
</script>

<style>
</style>