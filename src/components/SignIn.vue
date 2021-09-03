<template>
  <div class="mb-3">
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
        :disabled="!emailAddress && emailStatus === 'not sent'"
        class="
          w-full
          text-gray-900
          disabled:text-gray-400
          disabled:bg-blue-100
          rounded
          bg-blue-100
          mt-3
          px-2
          rounded
          hover:bg-blue-300
          transition-all
          duration-100
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
        return
      }
      this.emailStatus = "sending"
      const enteredEmail = this.emailAddress;
      const auth = getAuth();
      const actionCodeSettings = {
        url: "https://cascade.page/signin",
        handleCodeInApp: true,
      };
      try {
        await sendSignInLinkToEmail(
          auth,
          this.emailAddress,
          actionCodeSettings
        );
        this.emailStatus = "sent";
      } catch (err) {}
      console.log("submit " + this.emailAddress);
    },
  },
};
</script>

<style>
</style>