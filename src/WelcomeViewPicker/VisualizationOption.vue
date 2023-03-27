<script setup lang="ts">
import { useIsTouchscreen } from "@/App/composables/useIsTouchscreen";
import HoverHint from "@/Drawer/HoverHint.vue";
import type { ViewProvider } from "@/viewProvider";
import { useVisualizationStore } from "@/Views/visualizationStore";
import { computed, onMounted, ref } from "vue";
const visualizationStore = useVisualizationStore();

const props = defineProps<{ vp: ViewProvider; isActive: boolean }>();
const emit = defineEmits<{ (event: "toggle"): void }>();

const canChange = computed(() => visualizationStore.activeViews.length > 1);

const hovering = ref(false);
const { canHover } = useIsTouchscreen();

const events = canHover.value
  ? {
      mouseover: () => {
        hovering.value = true;
      },
      mouseleave: () => {
        hovering.value = false;
      },
    }
  : {};
</script>

<template>
  <div
    class="flex flex-col gap-2 p-2 group dark:hover:bg-slate-600 hover:bg-slate-200 rounded transition cursor-pointer outline outline-2 outline-slate-200 dark:outline-slate-600"
  >
    <h1 class="text-xl font-bold flex flex-row items-center gap-2">
      <div class="h-5 w-5" v-html="vp.iconSvg"></div>
      {{ vp.name }}
      <!-- <div class="ml-auto px-1 relative" v-on="events">
        <transition>
          <input
            class="transition"
            :class="{
              'opacity-100': isActive,
              'opacity-0 group-hover:opacity-100': !isActive,
            }"
            type="checkbox"
            :checked="isActive"
            :disabled="isActive && !canChange"
            @click.stop=""
            @change.prevent.stop="emit('toggle')"
          />
        </transition>
        <HoverHint :hovering="hovering" hover-position="top" :left="-3"
          ><span class="text-sm">Quick access</span></HoverHint
        >
      </div> -->
    </h1>
    <div class="py-1" v-if="vp.screenshots && vp.screenshots.length">
      <img :src="vp.screenshots[0]" class="rounded" />
    </div>
    <div
      class="font-medium text-slate-500 dark:text-slate-400 text-sm"
      v-if="vp.description"
    >
      {{ vp.description }}
    </div>
  </div>
</template>

<style scoped></style>
