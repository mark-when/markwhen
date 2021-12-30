<template>
  <div class="flex-grow flex flex-row items-center">
    <button
      class="hover:bg-gray-800 transition rounded cursor-text text-left w-full"
      v-if="username && !choosingUsername"
      @click="chooseUsername"
    >
      {{ username }}
    </button>
    <choose-user-name
      v-if="choosingUsername"
      :currentUsername="username"
      :focusInput="focusInput"
      @goBack="choosingUsername = !username"
    />
    <a :href="`/${username}`" target="_blank" class="ml-2" v-else
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-4 w-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        ></path></svg
    ></a>
  </div>
</template>

<script lang="ts">
import ChooseUserName from "./ChooseUserName.vue";
import { getApp } from "firebase/app";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Vue from "vue";

export default Vue.extend({
  components: {
    ChooseUserName,
  },
  data() {
    return {
      username: "",
      focusInput: false,
      choosingUsername: false,
    };
  },
  methods: {
    doc(path: string) {
      return doc(getFirestore(getApp()), path);
    },
    chooseUsername() {
      this.choosingUsername = true;
      this.focusInput = true;
    },
  },
  async created() {
    const vm = this;
    const currentUser = getAuth()?.currentUser?.uid;
    onSnapshot(
      vm.doc(`users/${currentUser}`),
      (snapshot) => {
        if (!snapshot.exists()) {
          vm.username = "";
          vm.choosingUsername = true;
          return;
        }
        vm.username = snapshot.data()!.username as string;
        if (!vm.username) {
          vm.choosingUsername = true;
        }
        vm.$store.commit("setUsername", vm.username);
      },
      console.error
    );
  },
});
</script>

<style>
</style>