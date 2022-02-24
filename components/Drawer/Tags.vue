<template>
  <div
    class="flex flex-row tags"
    style="
      flex-wrap: nowrap;
      overflow-x: auto;
      --webkit-overflow-scrolling: touch;
    "
  >
    <button
      class="
        mr-2
        rounded
        bg-gray-800
        hover:bg-gray-700
        md:px-2 md:py-0
        p-1
        flex flex-row flex-shrink-0
        items-center
        text-gray-400
        hover:text-gray-100
        tagButton
      "
      @click="clearFilters"
      v-if="Object.keys(tags).length > 0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 md:mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        /></svg
      ><span>Show all</span>
    </button>
    <tag v-for="tag in Object.keys(tags)" :key="tag" :tag="tag"></tag>
    <div class="flex flex-row font-mono text-gray-400" v-if="false">
      <div>
        {{ JSON.stringify(timeMarkerWeights) }}
      </div>
      <div class="ml-2">
        {{ JSON.stringify(Math.floor(settings.scale * 100) / 100) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import Tag from "./Tag.vue";

export default Vue.extend({
  components: { Tag },
  computed: {
    ...mapGetters(["tags", "timeMarkerWeights"]),
    ...mapState(["settings"]),
  },
  data() {
    return {
      debug: this.$config.dev,
    };
  },
  methods: {
    clearFilters() {
      this.$store.commit("clearFilters");
    },
  },
});
</script>

<style>
.tags::-webkit-scrollbar {
  display: none;
}
</style>