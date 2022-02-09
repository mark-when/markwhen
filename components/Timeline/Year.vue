<template>
  <div class="year flex-shrink-0 relative" :style="yearColumnStyle">
    <h6 class="yearTitle text-sm" :style="yearStyle">{{ year.year }}</h6>
    <!-- <template v-if="this.columnWidth > 600">
      <div
        class="absolute h-full"
        v-for="m in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
        :key="m"
        :style="styleForMonth(m)"
      ></div>
    </template> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex"

export default Vue.extend({
  props: ["year"],
  // methods: {
  //   styleForMonth(m: number) {
  //     const sty = {
  //       top: "0px",
  //       left: `${m * (this.columnWidth / 12)}px`,
  //     } as any;
  //     if (m !== 0 && m !== 12 && this.columnWidth > 600) {
  //       let alpha = 0.2;
  //       sty["border-left"] = `1px dashed rgba(128, 128, 128, ${
  //         alpha + 0.3 * (this.columnWidth / 1600)
  //       })`;
  //     }
  //     return sty;
  //   },
  // },
  data() {
    return {
      columnWidth: 30
    }
  },
  computed: {
    ...mapState({
      scale: (state: any) => state.settings.scale
    }),
    yearColumnStyle(): string {
      return `width: ${this.columnWidth}px; border-left: 1px dashed rgba(128, 128, 128, 1)`;
    },
    yearStyle(): string {
      let alpha;
      if (this.columnWidth < 80) {
        alpha = (this.columnWidth - 30) / 70;
      } else {
        alpha = 1;
      }
      const color =
        this.year % 10 === 0 ? "white" : `rgba(255, 255, 255, ${alpha})`;
      return `color: ${color};`;
    },
  },
});
</script>

<style>
.year {
  border-left: 1px dashed rgba(128, 128, 128, 0.678);
  height: 100%;
  font-family: system-ui;
}

.yearTitle {
  font-weight: 300;
  margin: 0px 0px 0px -1px;
  position: sticky;
  top: 0px;
  padding: 8px;
  z-index: 1;
}
</style>