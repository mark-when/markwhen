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
      <div class="flex flex-col mb-3 w-full order-1 md:order-2">
        <timeline-editor /> 
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";
import Profile from "./Profile/Profile.vue";
import DrawerHeader from "./DrawerHeader.vue";
import TimelineEditor from "./TimelineEditor.vue"

export default {
  components: {
    Storage,
    Profile,
    DrawerHeader,
    TimelineEditor
  },
  data() {
    return { collapsed: false };
  },
};
</script>

<style>
</style>