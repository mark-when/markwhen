<script setup lang="ts">
import { ref } from "vue";
import WelcomeBanner from "./WelcomeBanner.vue";
import ViewPicker from "./ViewPicker.vue";

const shouldShowBanner = () => {
  const hide = localStorage.getItem("hideWelcomeBanner");
  if (typeof hide !== "undefined" && !!hide) {
    return false;
  }
  return true;
};

const showingBanner = ref(shouldShowBanner());

const close = () => {
  localStorage.setItem("hideWelcomeBanner", "true");
  showingBanner.value = false;
};
</script>

<template>
  <div class="w-full h-full flex justify-center @container">
    <main
      class="@lg:py-6 px-2 py-2 @lg:px-24 flex flex-col gap-4 overflow-auto"
    >
      <WelcomeBanner v-if="showingBanner" @close="close"></WelcomeBanner>
      <ViewPicker></ViewPicker>
    </main>
  </div>
</template>

<style scoped>
main {
  width: min(104ch, 100%);
}
</style>
