<script setup lang="ts">
import { computed } from "vue";
import JumpToRangeDialog from "@/Jump/JumpToRangeDialog.vue";
import { useJumpStore } from "@/Jump/jumpStore";

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
</template>

<style scoped></style>
