<template>
  <div class="my-1">
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
          disabled:cursor-default
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
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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