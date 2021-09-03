<template>
  <div>
    <timeline />
    <sidebar/>
  </div>
</template>

<script lang="ts">
import Timeline from "./Timeline.vue";
import Sidebar from "./Sidebar.vue";

export default {
  components: { Sidebar, Timeline, Storage },
};
</script>

<style>
body {
  background-color: #384047;
  color: white;
  height: 100vh;
  margin: 0;
}
</style>
