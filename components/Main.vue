<template>
  <div id="app">
    <div class="flex flex-row h-full">
      <sidebar />
      <timeline />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Timeline from "./Timeline/Timeline.vue";
import Drawer from "./Drawer/Drawer.vue";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import Sidebar from "./Drawer/Sidebar.vue";

export default Vue.extend({
  props: ["edittable"],
  components: { Drawer, Timeline, Sidebar },
  mounted() {
    this.signInIfNecessary();
    this.$store.commit("getLocalTimelines");
  },
  methods: {
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
  background-color: #384047;
  color: white;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
