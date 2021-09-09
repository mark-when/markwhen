<template>
  <div class="flex flex-col">
    <div class="mt-1" v-if="$store.state.list && $store.state.list.length > 0">
      <timeline-item
        v-for="item in $store.state.list"
        :key="item"
        :item="item"
        @selected="selected"
        @deleteItem="deleteItem"
      ></timeline-item>
    </div>
  </div>
</template>

<script lang="ts">
import TimelineItem from "./LocalTimelineItem.vue";
import Vue from "vue";

export default Vue.extend({
  components: { TimelineItem },
  methods: {
    selected(item: string) {
      this.$store.commit("setCurrentTimeline", item);
    },
    deleteItem(item: string) {
      if (confirm(`Delete ${item}?`)) {
        this.$store.commit("removeTimeline", item);
      }
    },
  },
});
</script>

<style>
</style>