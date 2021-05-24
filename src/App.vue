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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
