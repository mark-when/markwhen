<template>
  <div
    class="flex flex-row overflow-x-scroll pages pb-1"
    style="--webkit-overflow-scrolling: touch"
  >
    <button
      class="
        h-6
        rounded-full
        border-2
        mr-2
        flex
        items-center
        justify-center
        transition
        flex-shrink-0
      "
      @mouseover="hovering = index"
      @mouseleave="hovering = -1"
      @click="$store.commit('setCascadeIndex', index)"
      :class="`${
        index === $store.state.cascadeIndex
          ? 'border-blue-300 bg-blue-50 dark:bg-slate-600 dark:border-slate-500'
          : 'border-white bg-white hover:bg-blue-50 border-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600'
      } ${cascade && cascade.metadata && cascade.metadata.title ? '' : 'w-6'} ${
        shadowed ? 'shadow' : ''
      }`"
      v-for="(cascade, index) in $store.getters.cascades.cascades"
      :key="index"
    >
      <h3
        v-if="cascade && cascade.metadata && cascade.metadata.title"
        class="px-3 font-bold text-gray-500 dark:text-gray-300"
      >
        {{ cascade.metadata.title }}
      </h3>
    </button>
    <button
      v-if="$store.state.editable"
      class="
        w-6
        h-6
        rounded-full
        border-2
        mr-2
        flex
        items-center
        justify-center
        transition
        border-white
        bg-white
        hover:bg-blue-50
        border-blue-100
        text-gray-500
        dark:text-gray-300
        dark:bg-slate-700
        dark:hover:bg-slate-600
        dark:border-slate-600
        flex-shrink-0
      "
      :class="shadowed ? 'shadow' : ''"
      @click="addNewPage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["shadowed"],
  data() {
    return {
      hovering: -1,
      showDelete: -1,
    };
  },
  watch: {
    hovering(val) {
      const vm = this;
      setTimeout(() => {}, 1000);
    },
  },
  methods: {
    addNewPage() {
      this.$store.dispatch("addNewPage");
    },
  },
});
</script>

<style>
.pages::-webkit-scrollbar {
  display: none;
}
</style>