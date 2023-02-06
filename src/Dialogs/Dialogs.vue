<script setup lang="ts">
import { computed } from "vue";
import JumpToRangeDialog from "@/Jump/JumpToRangeDialog.vue";
import { useJumpStore } from "@/Jump/jumpStore";
import ViewsDialog from "./ViewsDialog.vue";

const jumpStore = useJumpStore();

const showJumpToRange = computed({
  get() {
    return jumpStore.showingJumpDialog;
  },
  set(val) {
    jumpStore.setShowJumpDialog(val);
  },
});
</script>

<template>
  <JumpToRangeDialog v-model="showJumpToRange" />
  <ViewsDialog></ViewsDialog>
</template>

<style scoped></style>
