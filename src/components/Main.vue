<template>
  <h1 class="text-3xl">Timeline Maker</h1>
  <div class="flex flex-row p-3">
    <storage :list="list" @selected="selectedTimeline" @delete="deleteTimeline"/>
    <div class="flex flex-col mr-3">
      <textarea
        class="border shadow-md flex-grow p-1"
        name="eventsField"
        cols="30"
        rows="10"
        v-model="events"
      ></textarea>
      <button
        class="bg-blue-100 mt-3 rounded shadow-md hover:shadow-none transition-all duration-100"
        @click="save"
      >
        Save
      </button>
    </div>

    <timeline-maker :eventString="events" class="flex-grow" />
  </div>
</template>

<script lang="ts">
import Storage from "./Storage.vue";
import TimelineMaker from "./TimelineMaker.vue";

export default {
  components: { TimelineMaker, Storage },
  data() {
    return {
      currentTimelineName: "",
      events: "1990: born\n2012-2015: in China\n10/01/2018-02/01/2021: Google",
      list: [] as string[],
    };
  },
  mounted() {
    this.getTimelines()
  },
  methods: {
    deleteTimeline(name: string) {
      if (confirm(`Delete ${name}?`)) {
        localStorage.removeItem(name)
        this.list.splice(this.list.indexOf(name), 1)
        localStorage.setItem('timelines', this.list.join(","))
      }
    },
    selectedTimeline(name: string) {
      this.loadTimeline(name)
    },
    save() {
      const timelineName = prompt(
        "Save timeline as: ",
        this.currentTimelineName
      );
      if (timelineName) {
        localStorage.setItem(timelineName, this.events);
        if (this.list.includes(timelineName)) {
          return;
        }
        this.list.push(timelineName);
        localStorage.setItem("timelines", this.list.join(","));
        this.getTimelines()
      }
    },
    loadTimeline(name: string) {
      this.events = localStorage.getItem(name) ?? "";
      this.currentTimelineName = name;
    },
    getTimelines() {
      console.log("loading timelines");
      const concatenatedList = localStorage.getItem("timelines");
      console.log(concatenatedList);
      if (concatenatedList) {
        this.list = concatenatedList.split(",");
      }
    },
  },
};
</script>

<style>
</style>