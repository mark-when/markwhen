<script setup lang="ts">

</script>

<template>
  <button ref="button" class="
          flex flex-row
          items-center
          sticky
          px-1
          mt-px
          dark:bg-opacity-60
          bg-opacity-20
        " :class="buttonClass" :style="buttonStyle" @mouseover="$emit('hovering', true)"
    @mouseleave="$emit('hovering', false)" @click="$emit('collapse')">
    <div class="flex flex-row flex-grow items-center justify-center">
      <span class="eventTitle" v-if="eventGroup.title" v-html="titleHtml">
      </span>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd"
        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
        clip-rule="evenodd" />
    </svg>
  </button>
</template>

<style scoped>
</style>