<template>
  <div class="my-3">
    <h3 class="text-red-400">Not signed in</h3>
    <form @submit.prevent="submit">
      <input
        v-if="emailStatus !== 'sent'"
        v-model="emailAddress"
        id="email"
        type="email"
        placeholder="Email address"
        class="px-1 text-black mt-1 w-full rounded"
      />
      <button
        :disabled="
          !emailAddress || emailStatus === 'sending' || emailStatus === 'sent'
        "
        class="
          flex flex-row
          items-center
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"
          />
          <path
            d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
          />
        </svg>
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
    };
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
    async submit() {
      if (this.emailStatus === "sending") {
        return;
      }
      this.emailStatus = "sending";
      const enteredEmail = this.emailAddress;
      const auth = getAuth();
      const actionCodeSettings = {
        url: window.location.origin,
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