<template>
  <div class="flex flex-col order-2 md:order-1 md:mr-4">
    <Storage />
    <sign-in v-if="!user" />
    <signed-in v-else :user="user"/>
  </div>
</template>

<script lang="ts">
import Storage from "../Storage.vue";
import SignIn from "./SignIn.vue";
import SignedIn from "./SignedIn.vue"
import { getAuth, User } from "firebase/auth";
import Vue from "vue"

export default Vue.extend({
  components: { Storage, SignIn, SignedIn },
  data() {
    return {
      user: null as User | null,
    };
  },
  mounted() {
    getAuth().onAuthStateChanged((user) => {
      this.user = user;
    });
  },
});
</script>

<style>
</style>