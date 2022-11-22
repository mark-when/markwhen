<script setup lang="ts">
defineProps<{ keyboardKey: string }>();
</script>

<template>
  <div class="ml-2 z-10 flex flex-row items-center justify-center mb-px">
    <div
      class="bg-indigo-100 dark:bg-indigo-900 rounded px-1 text-sm text-indigo-900 dark:text-indigo-50 key relative"
    >
      {{ keyboardKey }}
    </div>
  </div>
</template>

<style scoped>
.key {
  line-height: 1.05rem;
  min-width: 16px;
}
.key::before {
  @apply bg-indigo-400 dark:bg-indigo-700 rounded shadow;
  content: "";
  position: absolute;
  bottom: calc(1px * -1.5);
  left: 0px;
  right: 0px;
  height: calc(100% + 1px);
  z-index: -1;
}
</style>
