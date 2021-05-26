<template>
  <main-vue />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainVue from './components/Main.vue'

export default defineComponent({
  name: 'App',
  components: {
    MainVue
  }
})
</script>

<style>
#app {
  position: absolute;
  bottom: 0px;
  left: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
