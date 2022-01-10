<template>
  <div class="bg-gray-900 h-full w-full overflow-scroll pb-5">
    <div class="flex flex-col p-2 text-gray-200">
      <h3 class="text-lg text-gray-300">Cascade.page</h3>
      <h3 class="text-lg">Help and How To</h3>
    </div>
    <div class="p-2 flex flex-col items-start">
      <a href="#howto_syntax" class="underline">Timeline Syntax</a>
      <a href="#howto_events" class="underline ml-2">Events</a>
      <a href="#howto_tags" class="underline ml-2">Tags</a>
      <a href="#howto_locations" class="underline ml-2">Locations</a>
      <a href="#howto_photos" class="underline ml-2">Photos</a>
      <a href="#howto_sharing" class="underline">Saving and sharing</a>
    </div>
    <div class="p-2 flex flex-col items-start">
      <a href="#howto_syntax" id="howto_syntax" class="underline text-xl"
        >Timeline Syntax</a
      >
      <p>A cascade is composed of one or more events.</p>
      <a href="#howto_events" id="howto_events" class="underline mt-4 text-lg"
        >Events</a
      >
      <p>
        An event looks something like this:
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300">
          01/01/2012: End of the world</span
        >
        where the date is in the American format of
        <span class="text-sm font-mono">MM/DD/YYYY</span>.
      </p>
      <p class="mt-2">
        An event lasts through its level of granularity. For example, if you had
        an event like
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300">
          01/2020: COVID in the US</span
        >, that means the event goes from the start of January 2020 to the end
        of January 2020. Likewise if you just specified a year, like
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300"
          >1861: Start of US Civil War</span
        >, that event would span the whole year of 1861, since we only specified
        the year and nothing else.
      </p>
      <p class="mt-2">
        Currently the highest level of granularity that cascade.page supports is
        one day, or 24 hours.
      </p>
      <p class="mt-2">
        In the editor, events can span multiple lines. Everything not on the
        first line (where the date range is specified)
        <strong>up to the next event</strong> will be put in an overflow box
        that can be expanded by clicking on the event. Such an overflow is
        indicated in the timeline with an ellipsis (...).
      </p>
      <a href="#howto_tags" id="howto_events" class="underline mt-4 text-lg"
        >Tags</a
      >
      <p>
        Events can be tagged using a hashtag:
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300"
          >#</span
        >. For example,
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300"
          >1999: The Matrix #movie</span
        >
      </p>
      <p class="mt-2">Events can then be filtered by their tags.</p>
      <p class="mt-2">
        To give tags specific colors, you can do something like this:
        <span class="rounded bg-gray-700 p-1 font-mono text-sm text-gray-300"
          >#movie: red</span
        >
        at the top of the timeline (before any events).
      </p>
      <a href="#howto_locations" id="howto_locations" class="underline mt-4 text-lg"
        >Locations</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style>
</style>