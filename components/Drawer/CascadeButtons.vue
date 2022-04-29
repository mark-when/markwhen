<template>
  <div
    class="flex flex-row overflow-x-scroll pages pb-1 pt-2"
    style="--webkit-overflow-scrolling: touch"
  >
    <cascade-button
      v-for="(cascade, index) in $store.getters.cascades"
      :key="index"
      :index="index"
      :cascade="cascade"
      :shadowed="shadowed"
    />
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
import CascadeButton from "./CascadeButton.vue";

export default Vue.extend({
  components: { CascadeButton },
  props: ["shadowed"],
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