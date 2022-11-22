import { usePageStore } from "@/Markwhen/pageStore";
import type { SomeNode } from "@markwhen/parser/lib/Node";
import { Event } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import { ref, unref, watchEffect } from "vue";

export const useEventColor = (eventRef: MaybeRef<SomeNode | Event>) => {
  const color = ref<string>();
  const pageStore = usePageStore();

  watchEffect(() => {
    const node = unref(eventRef);
    let ourTags: string[] | undefined;
    if (node instanceof Event) {
      ourTags = node.event.tags;
    } else {
      ourTags = node.isEventNode() ? node.eventValue().event.tags : node.tags;
    }
    color.value = ourTags ? pageStore.tags[ourTags[0]] : undefined;
  });

  return { color };
};
