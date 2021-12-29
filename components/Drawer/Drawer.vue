<template>
  <div
    class="
      fixed
      bottom-1
      left-0
      md:right-auto
      right-0
      z-30
      flex flex-col
      overflow-hidden
      md:max-w-1/2
    "
    :class="
      !collapsed && collapsible ? 'md:top-6 top-auto h-1/2 md:h-auto' : ''
    "
  >
    <template v-if="collapsible">
      <div
        class="
          flex flex-col
          md:flex-row
          p-2
          mx-2
          mt-2
          overflow-auto
          bg-gray-900
          flex-grow
        "
        v-show="!collapsed"
      >
        <timeline-editor />
      </div>
      <div
        class="
          flex flex-col
          md:flex-row
          p-2
          mx-2
          mt-2
          overflow-auto
          bg-gray-900
          flex-shrink
        "
        v-show="!collapsed"
      >
        <profile />
      </div>
    </template>

    <drawer-header v-model="collapsed" :collapsible="collapsible" />
    <div class="flex">
      <a
        class="underline ml-2 text-gray-300 text-sm"
        href="https://github.com/kochrt/cascade.page"
        target="_blank"
        >GitHub</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Profile from "./Profile/Profile.vue";
import DrawerHeader from "./DrawerHeader.vue";
import TimelineEditor from "./TimelineEditor.vue";
import { mapState } from "vuex";

export default {
  props: ["collapsible"],
  components: {
    Profile,
    DrawerHeader,
    TimelineEditor,
  },
  data() {
    return { collapsed: false, ...mapState(["selectedComponent"]) };
  },
};
</script>

<style>
</style>