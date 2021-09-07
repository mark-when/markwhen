<template>
  <div>
    <textarea
      class="flex-grow p-2 font-mono text-sm w-full text-gray-400 bg-gray-900 outline-none"
      name="eventsField"
      rows="12"
      wrap="off"
      :value="$store.state.eventsString"
      @input="updateEventsString"
    ></textarea>
    <div class="mt-3 flex flex-row text-gray-300">
      <share-button @click="share"/>
      <save-locally-button @click="saveLocally" />
      <a
        class="underline ml-auto"
        href="https://github.com/kochrt/cascade.page"
        target="_blank"
        >GitHub</a
      >
    </div>
  </div>
</template>

<script>
import ShareButton from './ShareButton.vue';
import SaveLocallyButton from './SaveLocallyButton.vue';

export default {
  components: { SaveLocallyButton, ShareButton },
  methods: {
    updateEventsString(e) {
      this.$store.commit("setEventsString", e.target.value);
    },
    async share() {
      console.log(await this.$rpc.get('/api/chooseUserName'))
    },
    saveLocally() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.$store.state.currentTimelineName
      );
      if (timelineName) {
        this.$store.commit("saveTimeline", timelineName);
      }
    },
  },
};
</script>

<style>
</style>