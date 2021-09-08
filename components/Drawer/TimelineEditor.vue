<template>
  <div>
    <textarea
      class="
        flex-grow
        p-2
        font-mono
        text-sm
        w-full
        text-gray-400
        bg-gray-900
        outline-none
      "
      name="eventsField"
      rows="12"
      wrap="off"
      :value="$store.state.eventsString"
      @input="updateEventsString"
    ></textarea>
    <div class="mt-3 flex flex-row text-gray-300">
      <share-button
        @click="share"
        :buttonTitle="buttonTitle"
        :disabled="buttonDisabled"
      />
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

<script lang="ts">
import ShareButton from "./ShareButton.vue";
import SaveLocallyButton from "./SaveLocallyButton.vue";
import { getApp } from "firebase/app";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import Vue from "vue";

export default Vue.extend({
  components: { SaveLocallyButton, ShareButton },
  data() {
    return {
      userId: "" as string | undefined,
      username: "",
      usernameListener: undefined as Unsubscribe | undefined,
      sharing: false
    };
  },
  computed: {
    buttonTitle(): string {
      if (this.sharing) {
        return "Sharing..."
      }
      if (!!this.userId) {
        if (!!this.username) {
          return "Share";
        } else {
          return "Create a username to share";
        }
      }
      return "Sign in to share";
    },
    buttonDisabled(): boolean {
      return this.sharing || !(this.userId && this.username)
    }
  },
  methods: {
    doc(path: string) {
      return doc(getFirestore(getApp()), path);
    },
    updateEventsString(e: TextEvent) {
      this.$store.commit(
        "setEventsString",
        (e?.target as HTMLInputElement).value
      );
    },
    async share() {
      const name = prompt(
        "To share to \ncascade.page/[username], share as [username]. \n\nOtherwise, cascades will be shared from \ncascade.page/[username]/[timeline name].",
        this.username
      );
      if (!name) {
        return;
      }
      this.sharing = true
      await this.$rpc.post("/api/share", {
        timeline: this.$store.state.eventsString,
        name,
      });
      this.sharing = false
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
  watch: {
    userId(val, oldVal) {
      const vm = this;
      if (val) {
        this.usernameListener = onSnapshot(
          this.doc(`users/${val}`),
          (snapshot) => {
            if (!snapshot.exists()) {
              return;
            }
            vm.username = snapshot.data().username;
          }
        );
      } else if (this.usernameListener) {
        this.usernameListener();
      }
    },
  },
  mounted() {
    const vm = this;
    onAuthStateChanged(getAuth(), function (user) {
      vm.userId = user?.uid;
    });
  },
});
</script>

<style>
</style>