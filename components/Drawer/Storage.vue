<template>
  <div class="flex flex-col flex-grow">
    <h3 class="border-b border-gray-500 text-gray-300">My cascades</h3>
    <div class="mt-1" v-if="$store.state.list && $store.state.list.length > 0">
      <timeline-item
        v-for="item in $store.state.list"
        :key="item"
        :item="item"
        @selected="selected"
        @deleteItem="deleteItem"
      ></timeline-item>
    </div>
    <div v-else>
      <div class="mt-1 text-gray-400">No saved cascades</div>
    </div>
  </div>
</template>

<script lang="ts">
import TimelineItem from "../Timeline/TimelineItem.vue"
import Vue from "vue"

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