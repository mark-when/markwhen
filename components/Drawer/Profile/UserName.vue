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
      @goBack="choosingUsername = false"
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
    const currentUser = getAuth()?.currentUser?.uid;
    onSnapshot(
      this.doc(`users/${currentUser}`),
      (snapshot) => {
        if (!snapshot.exists()) {
          this.username = "";
          this.choosingUsername = true;
          return;
        }
        this.username = snapshot.data()!.username as string;
        if (!this.username) {
          this.choosingUsername = true
        }
      },
      console.error
    );
  },
});
</script>

<style>
</style>