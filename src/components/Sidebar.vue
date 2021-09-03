<template>
  <div
    class="
      fixed
      bottom-0
      left-0
      right-0
      pt-2
      px-2
      z-30
      backdrop-filter backdrop-blur-2xl
      border-t border-gray-600
      flex flex-col
      overflow-hidden
    "
    style="max-height: 50vh"
  >
    <drawer-header v-model="collapsed" />
    <div
      class="flex flex-col md:flex-row pt-1 overflow-auto"
      v-show="!collapsed"
    >
      <profile />
      <div class="flex flex-col mb-3 text-black w-full order-1 md:order-2">
        <textarea
          class="border shadow-md flex-grow p-2 font-mono text-sm w-full"
          name="eventsField"
          rows="12"
          wrap="off"
          v-model="$store.state.eventsString"
        ></textarea>
        <button
          class="
            bg-blue-100
            mt-3
            rounded
            hover:bg-blue-300
            transition-all
            duration-100
          "
          @click="save"
        >
          Save cascade
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";
import Profile from "./Profile.vue";
import DrawerHeader from "./DrawerHeader.vue";

export default {
  components: {
    Storage,
    Profile,
    DrawerHeader,
  },
  data() {
    return { collapsed: false };
  },
  methods: {
    save() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.$store.state.currentTimelineName
      );
      if (timelineName) {
        this.$store.commit("saveTimeline", timelineName);
      }
    },
  },
};
</script>

<style>
</style>