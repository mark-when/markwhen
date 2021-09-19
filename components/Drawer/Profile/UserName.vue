<template>
  <div>
    <button
      class="hover:bg-gray-800 transition rounded cursor-text"
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
      this.focusInput = true
    },
  },
  async created() {
    const vm = this
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
          vm.choosingUsername = true
        }
        vm.$store.commit('setUsername', vm.username)
      },
      console.error
    );
  },
});
</script>

<style>
</style>