import { usePageStore } from "@/Markwhen/pageStore";
import type { Event, EventSubGroup } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import { ref, unref, watchEffect } from "vue";

export const useEventColor = (eventRef: MaybeRef<Event | EventSubGroup>) => {
  const color = ref<string | null>(null);
  const pageStore = usePageStore();

  watchEffect(() => {
    const event = unref(eventRef);
    const ourTags = Array.isArray(event) ? event.tags : event.event.tags;
    color.value = ourTags ? pageStore.tags[ourTags[0]] : null;
  });

  return { color };
};
