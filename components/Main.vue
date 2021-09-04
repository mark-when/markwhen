<template>
  <div id="app">
    <timeline />
    <sidebar />
  </div>
</template>

<script lang="ts">
import Timeline from "./Timeline.vue";
import Sidebar from "./Sidebar.vue";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export default {
  components: { Sidebar, Timeline },
  async mounted() {
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
      await signInWithEmailLink(auth, email, window.location.href);
    } catch (err) {
      alert(err)
    }
    localStorage.removeItem('emailForSignIn')
    window.location.href = window.location.origin
  },
};
</script>

<style>
body {
  background-color: #384047;
  color: white;
  height: 100vh;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
