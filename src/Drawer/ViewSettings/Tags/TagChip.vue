<script setup lang="ts">
defineProps<{ color: string }>();
</script>

<template>
  <div
    class="ml-2 z-10 flex flex-row items-center justify-center mb-px absolute rounded"
    :style="{ backgroundColor: `rgba(${color}, 0.5)` }"
  >
    <div class="rounded w-4 h-4 px-1 text-sm chip relative"></div>
  </div>
</template>

<style scoped>
.chip {
  line-height: 1.05rem;
  min-width: 16px;
}
.chip::before {
  @apply rounded;
  background-color: rgba(v-bind(color), 1);
  content: "";
  position: absolute;
  bottom: 0;
  left: 0px;
  right: calc(1px * -1.5);
  width: calc(100% + 1px);
  z-index: -1;
  height: 100%;
}
</style>
