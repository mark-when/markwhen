import { usePageStore } from "@/Markwhen/pageStore";
import type { MaybeRef } from "@vueuse/core";
import { ref, watchEffect, unref } from "vue";

export const useTagColor = (tag: MaybeRef<string>) => {
  const pageStore = usePageStore();

  const color = ref<string>();

  watchEffect(() => (color.value = pageStore.tags[unref(tag)]));

  return color;
};
