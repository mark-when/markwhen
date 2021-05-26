<template>
  <div class="flex flex-col">
    <div class="flex">
      <!-- <iframe frameborder="0" ref="frame" class="flex-grow"></iframe> -->
      <teleport to="body">
        <timeline :events="events" />
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">

import { debounce } from "throttle-debounce";
import Timeline from "./Timeline.vue";
import { DateRange, Event } from "../Types";

export default {
  components: {
    Timeline,
  },
  props: {
    eventString: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      htmlString: "",
      events: [] as Event[],
    };
  },
  watch: {
    eventString: function (val, oldVal) {
      this.debouncedParse();
    },
  },
  created() {
    this.debouncedParse = debounce(400, this.parse);
  },
  methods: {
    debouncedParse: () => {},
    parse() {
      let eventStrings = this.eventString.split("\n");
      this.events = eventStrings
        // Filter empty strings and comments
        .filter((str) => !!str && str.match(/^\s*\/\/.*/) === null)
        .map((eventString) => {
          const colonIndex = eventString.indexOf(":");
          if (colonIndex === -1) {
            throw new Error(
              `Error parsing '${eventString}': missing separating colon (:)`
            );
          }
          const dateString = eventString.substring(0, colonIndex).trim();
          return new Event(
            new DateRange(dateString),
            eventString.substring(colonIndex + 1).trim()
          );
        });
    },
  },
  mounted() {
    this.parse();
  },
};
</script>

<style>
iframe {
  border: 1px solid black;
  width: 800px;
  min-height: 500px;
  height: 80vh;
}
</style>