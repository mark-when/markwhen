<template>
  <div
    class="
      fixed
      bottom-0
      left-0
      right-0
      p-2
      z-30
      backdrop-filter backdrop-blur-2xl
      border-t border-gray-600
    "
    style="max-height: 50vh"
  >
    <div class="flex flex-row">
      <div class="underline flex items-end">
        <a href="https://github.com/kochrt/cascade.page">GitHub</a>
      </div>
      <display-settings></display-settings>
      <tags></tags>
      <button
        class="
          ml-auto
          hover:bg-gray-500
          rounded
          px-3
          flex flex-row
          items-center
        "
        @click="collapsed = !collapsed"
      >
        <span class="hidden md:block">{{
          collapsed ? "Expand" : "Collapse"
        }}</span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          v-if="!collapsed"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          v-if="collapsed"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
    <div class="flex flex-col pt-3" v-show="!collapsed">
      <Storage
        :list="list"
        @selected="selectedTimeline"
        @delete="deleteTimeline"
      />
      <div class="">
        <div class="flex flex-col mb-3 text-black">
          <textarea
            class="border shadow-md flex-grow p-2 font-mono text-sm"
            name="eventsField"
            cols="55"
            rows="12"
            v-model="$store.state.eventsString"
          ></textarea>
          <button
            class="
              bg-blue-100
              mt-3
              rounded
              shadow-md
              hover:shadow-none
              transition-all
              duration-100
            "
            @click="save"
          >
            Save cascade
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";
import Tags from "./Tags.vue";
import DisplaySettings from "./DisplaySettings.vue";

export default {
  components: {
    Storage,
    Tags,
    DisplaySettings,
  },
  data() {
    return { collapsed: false, currentTimelineName: "", list: [] as string[] };
  },
  mounted() {
    this.getTimelines();
  },
  methods: {
    deleteTimeline(name: string) {
      if (confirm(`Delete ${name}?`)) {
        localStorage.removeItem(name);
        this.list.splice(this.list.indexOf(name), 1);
        localStorage.setItem("timelines", this.list.join(","));
      }
    },
    selectedTimeline(name: string) {
      this.loadTimeline(name);
    },
    save() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.currentTimelineName
      );
      if (timelineName) {
        localStorage.setItem(timelineName, this.$store.state.eventsString);
        if (this.list.includes(timelineName)) {
          return;
        }
        this.list.push(timelineName);
        localStorage.setItem("timelines", this.list.join(","));
      }
    },
    loadTimeline(name: string) {
      this.$store.commit("setEventsString", localStorage.getItem(name) ?? "");
      this.currentTimelineName = name;
    },
    getTimelines() {
      const concatenatedList = localStorage.getItem("timelines");
      if (concatenatedList) {
        this.list = concatenatedList.split(",");
        this.loadTimeline(this.list[0]);
      }
    },
  },
};
</script>

<style>
</style>