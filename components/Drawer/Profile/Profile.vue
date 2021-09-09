<template>
  <div class="flex flex-col order-2 md:order-1 md:mr-4">
    <timeline-list />
    <sign-in v-if="!user" />
    <signed-in v-else :user="user"/>
  </div>
</template>

<script lang="ts">
import SignIn from "./SignIn.vue";
import SignedIn from "./SignedIn.vue"
import { getAuth, User } from "firebase/auth";
import Vue from "vue"
import TimelineList from "../TimelineList/TimelineList.vue";

export default Vue.extend({
  components: { SignIn, SignedIn, TimelineList },
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