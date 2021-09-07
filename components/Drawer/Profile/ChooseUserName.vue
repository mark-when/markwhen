<template>
  <form class="flex flex-row" @submit.prevent="chooseUserName">
    <input
      ref="input"
      type="text"
      class="bg-gray-900 rounded outline-none"
      placeholder="username"
      required
      v-model="username"
      pattern="[\w\d_-]+"
    />
    <button
      type="button"
      class="ml-2"
      v-if="currentUsername"
      @click="$emit('goBack')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
        />
      </svg>
    </button>
    <button
      type="submit"
      class="ml-2 disabled:text-gray-500"
      :disabled="!enabled"
    >
      <svg
        v-if="usernameStatus === 'not chosen'"
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
        />
      </svg>
      <svg
        v-else-if="usernameStatus === 'choosing'"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <svg
        v-else-if="usernameStatus === 'unavailable'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

type UsernameStatus = "not chosen" | "choosing" | "chosen" | "unavailable";

export default Vue.extend({
  props: ["currentUsername", "focusInput"],
  data() {
    return {
      username: this.currentUsername || "",
      usernameStatus: "not chosen" as UsernameStatus,
    };
  },
  computed: {
    enabled(): boolean {
      return (
        this.username !== this.currentUsername &&
        this.usernameStatus !== "choosing"
      );
    },
  },
  mounted() {
    if (this.focusInput) {
      (this.$refs.input as HTMLInputElement).focus();
    }
  },
  watch: {
    username(val, oldVal) {
      this.usernameStatus = 'not chosen'
    }
  },
  methods: {
    async chooseUserName() {
      if (!this.enabled) {
        return;
      }
      this.usernameStatus = "choosing";
      try {
        const result = await this.$rpc.post("/api/chooseUserName", {
          username: this.username,
        });
        if (result.status === 200) {
          this.usernameStatus = "chosen";
          this.$emit("goBack");
        } else {
          this.usernameStatus = "unavailable";
        }
      } catch (err) {
        this.usernameStatus = "unavailable";
      }
    },
  },
});
</script>

<style scoped>
input:invalid {
  @apply text-red-700;
}
</style>