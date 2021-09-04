<template>
  <div class="my-3">
    <h3 class="text-gray-300">{{ user.email }}</h3>
    <div class="flex flex-row">
      <span class="text-gray-300">cascade.page/</span>
      <user-name/>
    </div>
    <button
      class="
        whitespace-nowrap
        w-full
        disabled:text-gray-400
        disabled:bg-blue-900
        rounded
        bg-blue-100
        mt-3
        px-2
        rounded
        items-center
        bg-blue-800
        hover:bg-blue-700
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