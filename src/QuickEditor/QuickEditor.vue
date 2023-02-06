<script setup lang="ts">
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { computed, ref } from "vue";

const markwhenStore = useMarkwhenStore();

const showing = ref(true);

const markwhen = computed({
  get() {
    return markwhenStore.rawTimelineString;
  },
  set(newString: string) {
    markwhenStore.setRawTimelineString(newString);
  },
});

const toggle = () => {
  showing.value = !showing.value;
};
</script>

<template>
  <div class="shadow flex flex-col absolute bottom-20 left-14 z-40">
    <div class="font-bold text-sm ml-auto dark:bg-slate-900 bg-white px-1">
      <button class="flex items-center justify-center p-1" @click="toggle">
        <svg
          v-if="showing"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          v-else
          class="h-4 w-4"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          ></path>
        </svg>
      </button>
    </div>
    <textarea
      v-if="showing"
      class="h-80 w-96 font-mono text-sm p-1 dark:bg-slate-900"
      v-model="markwhen"
    />
  </div>
</template>

<style scoped>
textarea {
  @apply focus:outline-none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
</style>
