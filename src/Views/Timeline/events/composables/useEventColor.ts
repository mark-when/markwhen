import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import type { Event, EventSubGroup } from "@markwhen/parser/lib/Types";
import type { MaybeRef } from "@vueuse/core";
import { isRef, ref, unref, watchEffect } from "vue";

export const useEventColor = (eventRef: MaybeRef<Event | EventSubGroup>) => {
  const color = ref<string | null>(null);

  const getColor = () => {
    const event = unref(eventRef);
    const { tags } = useMarkwhenStore();
    const ourTags = Array.isArray(event) ? event.tags : event.event.tags;
    color.value = ourTags ? tags[ourTags[0]] : null;
  };
  
  if (isRef(eventRef)) {
    watchEffect;
  } else {
    getColor();
  }

  return { color };
};
