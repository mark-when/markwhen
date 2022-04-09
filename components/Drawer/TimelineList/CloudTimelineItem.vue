<template>
  <div
    class="
      cursor-pointer
      flex flex-row
      align-baseline
      mb-1
      rounded
      px-2
      py-1
      transition transition-all
      duration-100
      text-slate-900
      dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800
      group
      hover:bg-slate-100
    "
    @click="selected"
  >
    <div class="flex flex-row items-center mr-4">
      <button
        class="text-gray-500 hover:text-red-500 mr-2"
        :disabled="deleting"
      >
        <svg
          v-if="deleting"
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else
          @click.prevent.stop="deleteTimeline"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4 mr-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="
          h-4
          w-4
          mr-1
          text-blue-100
          group-hover:text-blue-300
          transition transition-all
        "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      {{ item.name }}
    </div>
    <div class="ml-auto flex flex-row items-center">
      <a :href="link" target="_blank" class="hover:text-blue-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import {
  deleteObject,
  StorageReference,
  getDownloadURL,
} from "firebase/storage";
import Vue from "vue";

export default Vue.extend({
  props: ["item"],
  data() {
    return {
      deleting: false,
      loading: false,
    };
  },
  computed: {
    link(): string {
      const username = this.$store.state.username;
      return this.item.name === username
        ? username
        : `${username}/${this.item.name}`;
    },
  },
  methods: {
    async deleteTimeline() {
      const vm = this;
      if (confirm(`Delete "${vm.item.name}"? This can't be undone.`)) {
        vm.deleting = true;
        await deleteObject(vm.item);
        vm.$emit("refresh");
      }
    },
    async selected() {
      this.loading = true;
      const downloadLink = await getDownloadURL(this.item);
      const timelineText = await fetch(downloadLink);
      this.$store.commit("setEventsString", await timelineText.text());
      this.loading = false;
    },
  },
});
</script>

<style>
</style>