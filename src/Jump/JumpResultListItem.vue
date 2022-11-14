<script setup lang="ts">
const emit = defineEmits<{ (event: "click"): void }>();
const props = defineProps<{
  selected: boolean;
  last: boolean;
}>();
</script>

<template>
  <div
    class="px-2 font-bold py-1 flex flex-col hover:bg-indigo-700 hover:dark:bg-indigo-600 hover:text-white"
    :class="{
      'bg-indigo-700 text-white dark:bg-indigo-600': selected,
      'dark:text-gray-200': !selected,
      'rounded-b': last,
    }"
    role="button"
    @click="emit('click')"
  >
    <div class="flex flex-row flex-shrink">
      <div
        class=""
        style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden"
      >
        <slot></slot>
      </div>
      <div class="ml-auto flex items-center justify-center pl-1">
        <slot name="right"></slot>
      </div>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<style scoped></style>
