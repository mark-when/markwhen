<template>
  <custom-scroller
    ref="recyclerScroller"
    class="flex absolute inset-0"
    page-mode
    :items="allYears"
    :item-size="columnWidth"
    key-field="item"
    direction="horizontal"
    :buffer="1000"
    ><template #before
      ><div
        class="fixed w-full h-12"
        style="
          background: linear-gradient(to bottom, #384047, 67%, #38404700);
          z-index: 1;
        "
      ></div
    ></template>
    <template v-slot="{ item }"
      ><year :year="item" :columnWidth="columnWidth" /></template
  ></custom-scroller>
</template>

<script lang="ts">
import Year from "./Year.vue";
//@ts-ignore
import Vue from "vue";
import CustomScroller from "../Timeline/CustomScroller.vue";
export default Vue.extend({
  components: { Year, CustomScroller },
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
});
</script>

<style>
.vue-recycle-scroller__item-view {
  @apply absolute top-0 left-0 h-full;
}
.resize-observer {
  @apply hidden;
}
</style>