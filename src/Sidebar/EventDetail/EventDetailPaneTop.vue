<script setup lang="ts">
import { useEventDetailStore } from "./eventDetailStore";

const eventDetailStore = useEventDetailStore();

const close = eventDetailStore.toggle;
</script>

<template>
  <div
    class="flex flex-row"
    :class="{ 'justify-end': !eventDetailStore.isLeft }"
  >
    <button
      role="button"
      title="Close/collapse sidebar"
      @click="close"
      class="transition p-2 md:mt-1 hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div class="flex-grow flex flex-row items-center justify-center">
      <div class="flex flex-row md:mt-1">
        <button
          class="uppercase font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 flex flex-row items-center p-2"
          style="line-height: initial"
        >
          <span
            ><svg
              class="w-4 h-4"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M14.71 6.71a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z"
              ></path></svg></span
          ><span>Prev</span>
        </button>
        <div class="w-px"></div>
        <button
          class="uppercase font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 flex flex-row items-center p-2"
          style="line-height: initial"
        >
          <span>next</span
          ><span
            ><svg
              class="w-4 h-4"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"
              ></path></svg
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
