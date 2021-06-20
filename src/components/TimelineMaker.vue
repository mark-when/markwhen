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
      eventStrings = eventStrings.filter((str) => !!str && str.match(/^\s*\/\/.*/) === null);
      this.events = []
      this.tags = {}
      for (let i = 0; i < eventStrings.length; i++) {
        const eventString = eventStrings[i];
        const colonIndex = eventString.indexOf(":");
        if (colonIndex === -1) {
          throw new Error(
            `Error parsing '${eventString}': missing separating colon (:)`
          );
        }
        const key = eventString.substring(0, colonIndex).trim();
        if (key.startsWith("!")) {
          // This is a tag
          const tagName = key.substring(1)
          this.tags[tagName] = eventString.substring(colonIndex + 1).trim()
        } else {
          this.events.push(
            new Event(
              new DateRange(key),
              new EventDescription(eventString.substring(colonIndex + 1).trim())
            )
          );
        }
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