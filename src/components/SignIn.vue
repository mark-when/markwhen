<template>
  <div class="my-3">
    <h3 class="text-red-400" v-if="!user">Not signed in</h3>
    <h3 class="text-gray-300" v-else>{{ user.email }}</h3>
    <form @submit.prevent="submit">
      <input
        v-if="!user && emailStatus !== 'sent'"
        v-model="emailAddress"
        id="email"
        type="email"
        placeholder="Email address"
        class="px-1 text-black mt-1 w-full rounded"
      />
      <button
        v-if="user"
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
      <button
        v-else
        :disabled="
          !emailAddress || emailStatus === 'sending' || emailStatus === 'sent'
        "
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
      >
        {{ buttonText }}
      </button>
    </form>
  </div>
</template>

<script>
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export default {
  data() {
    return {
      emailAddress: null,
      emailStatus: "not sent",
      user: null,
    };
  },
  mounted() {
    getAuth().onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  computed: {
    buttonText() {
      if (this.emailStatus === "not sent") {
        return "Send signin link";
      }
      if (this.emailStatus === "sending") {
        return "Sending...";
      }
      if (this.emailStatus === "sent") {
        return "Sent. Check your inbox.";
      }
    },
  },
  methods: {
    signOut() {
      if (confirm("Sign out?")) {
        getAuth().signOut();
      }
    },
    async submit() {
      if (this.emailStatus === "sending") {
        return;
      }
      this.emailStatus = "sending";
      const enteredEmail = this.emailAddress;
      const auth = getAuth();
      const actionCodeSettings = {
        url: "https://cascade.page",
        handleCodeInApp: true,
      };
      try {
        await sendSignInLinkToEmail(auth, enteredEmail, actionCodeSettings);
        this.emailStatus = "sent";
        localStorage.setItem("emailForSignIn", enteredEmail);
      } catch (err) {
        alert("Error sending signin email: " + err);
      }
    },
  },
};
</script>

<style>
</style>