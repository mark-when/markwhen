<template>
  <div id="app" :class="darkMode">
    <div
      class="
        flex flex-col
        md:flex-row
        h-full
        dark:bg-baseGray
        bg-slate-200
        dark:text-white
        text-gray-900
      "
    >
      <template v-if="edittable">
        <sidebar v-show="$store.state.sidebar.visible"
      /></template>
      <timeline :edittable="edittable" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "./Timeline/Timeline.vue";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import Sidebar from "./Drawer/Sidebar.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  props: ["edittable"],
  components: { Timeline, Sidebar },
  computed: mapGetters({ darkMode: "sidebar/darkMode" }),
  mounted() {
    this.signInIfNecessary();
    this.checkDarkMode();
    this.$store.commit("getLocalTimelines");
    this.$store.commit("checkHasSeenHowTo");
  },
  methods: {
    checkDarkMode() {
      this.$store.commit("sidebar/checkDarkMode");
    },
    async signInIfNecessary() {
      const auth = getAuth();
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return;
      }
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Confirm your email to sign in");
      }
      if (!email) {
        alert("Missing email!");
        return;
      }
      try {
        const user = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
      } catch (err) {
        alert(err);
      }
      localStorage.removeItem("emailForSignIn");
      window.location.href = window.location.origin;
    },
  },
});
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
