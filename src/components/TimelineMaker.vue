<template>
  <div class="flex flex-col">
    <div class="flex">
      <teleport to="body">
        <timeline :events="events" :tags="tags" />
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from "throttle-debounce";
import Timeline from "./Timeline.vue";
import { DateRange, Event, EventDescription } from "../Types";

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
      tags: {} as { [tagName: string]: string },
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

      // Filter empty strings and comments
      eventStrings = eventStrings.filter(
        (str) => !!str && str.match(/^\s*\/\/.*/) === null
      );
      this.events = [];
      this.tags = {};
      for (let i = 0; i < eventStrings.length; i++) {
        const eventString = eventStrings[i].trim();
        const colonIndex = eventString.indexOf(":");

        if (eventString.startsWith("!")) {
          // This is a tag
          const tagName = eventString.substring(1, colonIndex === -1 ? eventString.length : colonIndex);
          this.tags[tagName] =
            colonIndex === -1
              ? ""
              : eventString.substring(colonIndex + 1).trim();
          continue;
        }

        if (colonIndex === -1) {
          throw new Error(
            `Error parsing '${eventString}': missing separating colon (:)`
          );
        }
        const dateString = eventString.substring(0, colonIndex).trim();
        const dateRange = new DateRange(dateString);
        const eventDescription = new EventDescription(
          eventString.substring(colonIndex + 1).trim()
        );
        for (let tag of eventDescription.tags) {
          if (!this.tags[tag]) {
            this.tags[tag] = "";
          }
        }
        this.events.push(new Event(dateRange, eventDescription));
      }
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