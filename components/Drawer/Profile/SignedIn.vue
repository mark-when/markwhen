<template>
  <div class="my-1">
    <h3 class="text-gray-400">{{ user.email }}</h3>
    <div class="flex flex-row">
      <a class="text-gray-400" href="/">cascade.page/</a>
      <user-name/>
    </div>
    <button
      class="
        whitespace-nowrap
        w-full
        disabled:text-gray-400
        disabled:bg-gray-900
        rounded
        mt-3
        px-2
        rounded
        items-center
        bg-gray-800
        hover:bg-gray-700
        transition-all
        duration-100
        text-gray-200
        hover:text-gray-50
      "
      @click="signOut"
    >
      Sign out
    </button>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import UserName from "./UserName.vue"

export default {
  components: { UserName },
  props: ["user"],
  methods: {
    signOut() {
      if (confirm("Sign out?")) {
        getAuth().signOut();
      }
    },
  },
};
</script>

<style>
</style>