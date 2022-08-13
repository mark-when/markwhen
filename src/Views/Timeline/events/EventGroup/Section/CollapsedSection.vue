<script setup lang="ts">
import type { EventSubGroup } from "@markwhen/parser/lib/Sort";
import { EventDescription } from "@markwhen/parser/lib/Types";
import { computed, ref } from "@vue/reactivity";
import { useEventColor } from "../../composables/useEventColor";

const props = defineProps<{ group: EventSubGroup }>();

const hovering = ref(false);
const titleHtml = computed(() =>
  EventDescription.toInnerHtml(props.group.title || "")
);

const { color } = useEventColor(props.group);
const hasDefinedColor = computed(() => !!color.value);
</script>

<template>
  <div
    class="dark:border-gray-600 eventTitle transition bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-30 hover:dark:bg-opacity-40 cursor-pointer"
    :class="{
      'bg-gray-400 dark:bg-gray-800 outline outline-1 dark:outline-gray-900/25 outline-gray-400/25':
        !hasDefinedColor,
    }"
    :style="
      hasDefinedColor
        ? {
            backgroundColor: `rgba(${color}, ${hovering ? '0.2' : '0.1'})`,
            outline: `1px solid rgba(${color}, 0.16)`,
          }
        : {}
    "
    @click="$emit('expand')"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="flex">
      <div class="sticky left-4 px-1 mt-px">
        <span class="" v-if="titleHtml" v-html="titleHtml"></span>
        ({{ group.length }})
      </div>
    </div>
  </div>
</template>

<style scoped>
.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
  font-weight: 600;
}
</style>
