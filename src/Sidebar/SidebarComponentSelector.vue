<script setup lang="ts">

</script>

<template>
<div class="flex flex-row md:flex-col items-center">
    <button
      class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
      :class="
        selectedComponent === 'editor' ? 'bg-slate-200 dark:bg-slate-700' : ''
      "
      @click="selectEdit"
      title="Timeline Editor"
    >
      <svg
        class="h-6 w-6"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        ></path>
      </svg>
    </button>
    <button
      class="
        p-2
        md:mb-3
        mb-0
        mr-3
        md:mr-0
        hover:bg-slate-200
        dark:hover:bg-slate-700
      "
      :class="
        selectedComponent === 'profile' ? 'bg-slate-200 dark:bg-slate-700' : ''
      "
      @click="selectProfile"
      title="My markwhen documents"
    >
      <svg
        class="h-6 w-6"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        ></path>
      </svg>
    </button>
    <button class="p-2" @click="selectHowTo" title="Help and How to">
      <svg
        class="h-6 w-6 rounded-full"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        :style="hasSeenHowTo ? '' : 'box-shadow: 0 0 8px 3px white'"
      >
        <path
          d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
</style>