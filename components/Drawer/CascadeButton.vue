<template>
  <button
    class="
      h-6
      rounded-full
      border-2
      mr-2
      flex
      items-center
      justify-center
      flex-shrink-0
      relative
    "
    @mouseover="startHover"
    @mouseleave="endHover"
    @click="$store.commit('setCascadeIndex', index)"
    :class="`${
      index === $store.state.cascadeIndex
        ? 'border-blue-300 bg-blue-50 dark:bg-slate-600 dark:border-slate-500'
        : 'border-white bg-white hover:bg-blue-50 border-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600'
    } ${cascadeTitle ? '' : 'w-6'} ${shadowed ? 'shadow' : ''}`"
  >
    <button
      class="
        absolute
        right-0
        top-0
        -translate-y-1/2
        translate-x-1/2
        text-slate-300
        hover:text-slate-500
        dark:text-slate-500
        dark:hover:text-slate-300
        rounded-full
        dark:bg-slate-700
        bg-slate-100
      "
      @click.prevent.stop="del"
      v-if="
        $store.state.editable &&
        $store.getters.cascades.length > 1 &&
        hovering
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <h3
      v-if="cascadeTitle"
      class="px-3 font-bold text-gray-500 dark:text-gray-300"
    >
      {{ cascadeTitle }}
    </h3>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Cascade } from "~/src/Types";

export default Vue.extend({
  props: ["cascade", "index", "shadowed"],
  data() {
    return {
      softHover: false,
      hovering: false,
      timer: undefined as number | undefined,
    };
  },
  computed: {
    cascadeTitle() {
      const c = this.cascade as Cascade;
      return (c && c.metadata && c.metadata.title) || "";
    },
  },
  methods: {
    del() {
      if (confirm(`Delete ${this.cascadeTitle || "this page"}?`)) {
        this.$store.dispatch("deletePage", this.index);
      }
    },
    endHover() {
      this.softHover = false;
      this.hovering = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    },
    startHover() {
      if (!this.timer) {
        const vm = this;
        vm.softHover = true;
        // @ts-ignore
        this.timer = setTimeout(() => {
          if (vm.softHover) {
            vm.hovering = true;
          }
        }, 750);
      }
    },
  },
});
</script>

<style>
</style>