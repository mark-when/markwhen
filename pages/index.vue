<template>
  <Main :edittable="true"/>
</template>

<script lang="ts">
import Vue from 'vue'
import Main from "~/components/Main.vue"

export default Vue.extend({ components: { Main }})
</script>
