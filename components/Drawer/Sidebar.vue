<template>
  <div
    class="
      h-full
      overflow-auto
      flex-shrink-0
      hover:bg-gray-800
      flex flex-row
      border-r border-gray-600
    "
    :class="selectedComponent ? 'bg-gray-800' : ''"
  >
    <div class="flex flex-col">
      <button
        class="p-2 hover:bg-gray-900"
        :class="selectedComponent === 'edit' ? 'bg-gray-900' : ''"
        @click="selectEdit"
      >
        <svg
          class="h-6 w-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          ></path>
        </svg>
      </button>
      <button
        class="p-2 hover:bg-gray-900"
        :class="selectedComponent === 'profile' ? 'bg-gray-900' : ''"
        @click="selectProfile"
      >
        <svg
          class="h-6 w-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          ></path>
        </svg>
      </button>
      <button
        class="p-2 hover:bg-gray-900"
        :class="selectedComponent === 'viewOptions' ? 'bg-gray-900' : ''"
        @click="selectViewOptions"
      >
        <svg
          class="h-6 w-6"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
          style="transform: scalex(-1)"
        >
          <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"></path>
        </svg>
      </button>
    </div>
    <div v-if="selectedComponent">
      <component :is="selectedComponentComponent" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineEditor from "./TimelineEditor.vue";
import Profile from "./Profile/Profile.vue";
import DrawerHeader from "./DrawerHeader.vue";
import { mapState } from "vuex";

export default Vue.extend({
  components: { TimelineEditor },
  computed: {
    ...mapState({
      selectedComponent: (state: any) => state.sidebar.selectedComponent,
    }),
    selectedComponentComponent() {
      if (this.selectedComponent === "edit") {
        return TimelineEditor;
      }
      return this.selectedComponent === "profile" ? Profile : DrawerHeader;
    },
  },
  methods: {
    selectEdit() {
      this.$store.commit("sidebar/setSelectedComponent", "edit");
    },
    selectProfile() {
      this.$store.commit("sidebar/setSelectedComponent", "profile");
    },
    selectViewOptions() {
      this.$store.commit("sidebar/setSelectedComponent", "viewOptions");
    },
  },
});
</script>

<style>
</style>