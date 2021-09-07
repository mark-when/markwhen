<template>
  <button
    class="
      flex flex-row
      items-center
      px-2
      bg-blue-800
      rounded
      transition-all
      duration-100
      text-gray-200
      hover:bg-blue-700
      hover:text-gray-50
      disabled:text-gray-400
      disabled:bg-blue-900
      mr-2
    "
    :disabled="!(userId && username)"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    {{ buttonTitle }}
  </button>
</template>

<script lang="ts">
import { getApp } from "firebase/app";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";

export default {
  data() {
    return {
      userId: "" as string | undefined,
      username: "",
      usernameListener: undefined as Unsubscribe | undefined,
    };
  },
  computed: {
    buttonTitle(): string {
      if (!!this.userId) {
        if (!!this.username) {
          return "Share";
        } else {
          return "Create a username to share";
        }
      }
      return "Sign in to share";
    },
  },
  watch: {
    userId(val, oldVal) {
      const vm = this;
      if (val) {
        this.usernameListener = onSnapshot(
          this.doc(`users/${val}`),
          (snapshot) => {
            if (!snapshot.exists()) {
              return;
            }
            vm.username = snapshot.data().username;
          }
        );
      } else if (this.usernameListener) {
        this.usernameListener();
      }
    },
  },
  methods: {
    doc(path: string) {
      return doc(getFirestore(getApp()), path);
    },
  },
  mounted() {
    const vm = this;
    onAuthStateChanged(getAuth(), function (user) {
      vm.userId = user?.uid;
    });
  },
};
</script>

<style>
</style>