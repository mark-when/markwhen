<template>
  <h1>Timeline Maker</h1>
  <p>Dates: YYYY or MM/YYYY or MM/DD/YYYY</p>
  <textarea name="eventsField" cols="30" rows="10" v-model="events"></textarea>
  <timeline-maker :eventString="events" />
</template>

<script>
import TimelineMaker from "./TimelineMaker.vue";

export default {
  components: { TimelineMaker },
  data() {
    return {
      events: "1990: born\n2012-2015: in China\n10/01/2018-02/01/2021: Google",
    };
  },
};
</script>

<style>
</style>