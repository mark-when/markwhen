<template>
  <div class="flex flex-col w-full flex-grow bg-gray-900 h-full pb-4">
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
        shadow-inner-2xl
        resize-none
      "
      style="padding-top: 10vh; padding-bottom: 80vh"
      name="eventsField"
      :value="$store.state.eventsString"
      @input="updateEventsString"
    ></textarea>
    <div class="my-3 flex flex-row text-gray-300 ml-2">
      <share-button
        @click="share"
        :buttonTitle="buttonTitle"
        :disabled="buttonDisabled"
      />
      <save-locally-button @click="saveLocally" />
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
      sharing: false,
    };
  },
  computed: {
    buttonTitle(): string {
      if (this.sharing) {
        return "Sharing...";
      }
      if (!!this.userId) {
        if (!!this.username) {
          return "Share...";
        } else {
          return "Create a username to share";
        }
      }
      return "Sign in to share";
    },
    buttonDisabled(): boolean {
      return this.sharing || !(this.userId && this.username);
    },
  },
  methods: {
    doc(path: string) {
      return doc(getFirestore(getApp()), path);
    },
    updateEventsString(e: InputEvent) {
      this.$store.commit(
        "setEventsString",
        (e?.target as HTMLInputElement).value
      );
      this.$store.commit("setDirtyEditor", true);
    },
    async share() {
      const name = prompt(
        `To share to \ncascade.page/${this.username}, share as ${this.username}. \n\nOtherwise, cascades will be shared from \ncascade.page/${this.username}/[timeline name].`,
        this.username
      );
      if (!name) {
        return;
      }
      this.sharing = true;
      try {
        await this.$rpc.post("/api/share", {
          timeline: this.$store.state.eventsString,
          name,
        });
        this.sharing = false;
        this.$store.commit("setDirtyEditor", false);
        this.$router.push(
          `/${this.username}${name === this.username ? "" : "/" + name}`
        );
      } catch (err) {
        console.error(err);
        alert("Unable to share timeline :(");
      }
    },
    saveLocally() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.$store.state.currentTimelineName
      );
      if (timelineName) {
        this.$store.commit("saveTimeline", timelineName);
        this.$store.commit("setDirtyEditor", false);
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