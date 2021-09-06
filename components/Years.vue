<template>
    <!-- <div id="years" class="flex absolute inset-0"> -->
    <RecycleScroller
      ref="recyclerScroller"
      page-mode
      class="flex absolute inset-0 pointer-events-none z-10"
      :items="allYears"
      :item-size="columnWidth"
      key-field="item"
      direction="horizontal"
      :buffer="1000"
      v-slot="{ item }"
      ><year :year="item" :columnWidth="columnWidth"
    /></RecycleScroller>
</template>

<script lang="ts">
import Year from "./Year.vue";
import { RecycleScroller } from "vue-virtual-scroller";

export default {
  components: { Year, RecycleScroller },
  props: ["columnWidth", "years"],
  methods: {
    range(size: number, startAt = 0): number[] {
      return [...Array(size).keys()].map((i) => i + startAt);
    },
  },
  computed: {
    allYears(): number[] {
      return this.range(
        this.years.end - this.years.start + 1,
        this.years.start
      );
    },
  },
};
</script>

<style>
.vue-recycle-scroller__item-view {
  @apply absolute top-0 left-0 h-full;
}
.resize-observer {
  @apply hidden;
}
</style>