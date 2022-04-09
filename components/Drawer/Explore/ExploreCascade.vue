<template>
  <div
    class="flex flex-row mb-1 p-1 items-center"
    :class="{ 'dark:bg-gray-800': hovering || forking }"
    v-on:mouseenter="mouseenter"
    v-on:mouseleave="mouseleave"
  >
    <a :href="cascade.cascadePath" class="font-mono text-sm"
      ><span
        class="underline"
        :class="parts.length > 1 ? 'text-gray-500' : ''"
        >{{ parts[0] }}</span
      ><span v-if="parts.length > 1" class="underline">{{ parts[1] }}</span></a
    >
    <div class="ml-auto" v-show="hovering || forking">
      <button
        @click="fork"
        :disabled="forking"
        class="
          flex flex-row
          items-center
          justify-center
          ml-2
          text-sm
          bg-slate-100
          px-1
          rounded
          transition
          dark:hover:bg-gray-900 dark:disabled:bg-gray-800 dark:text-gray-400
          text-slate-900
          hover:bg-slate-100
        "
      >
        <svg
          v-if="!forking"
          class="h-4 w-4 mr-1"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="m14.06 9.02.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
          ></path>
        </svg>
        <svg
          v-else
          :class="forking ? '' : 'mr-1'"
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
        <span>{{ forking ? "" : "Fork" }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["cascade"],
  computed: {
    parts(): string[] {
      const slash = (this.cascade.cascadePath as string).indexOf("/");
      if (slash) {
        return [
          this.cascade.cascadePath.substring(0, slash + 1),
          this.cascade.cascadePath.substring(slash + 1),
        ];
      }
      return [this.cascade.cascadePath];
    },
  },
  data() {
    return {
      hovering: false,
      forking: false,
    };
  },
  methods: {
    mouseenter() {
      this.hovering = true;
    },
    mouseleave() {
      this.hovering = false;
    },
    async fork() {
      const proceed = confirm(
        "This will replace any cascade you are currently editing. If you have unsaved work, you may want to save it before proceeding."
      );
      if (!proceed) {
        return;
      }
      this.forking = true;
      const file = (
        await this.$rpc.get(`/api/cascade/${this.cascade.filePath}`)
      ).data;
      this.$store.commit("setEventsString", file);
      // if (this.$store.state.sidebar.selectedComponent !== "editor") {
      //   this.$store.commit("sidebar/setSelectedComponent", "editor");
      // }
      this.forking = false;
    },
  },
});
</script>

<style>
</style>