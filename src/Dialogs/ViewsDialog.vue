<script setup lang="ts">
import { computed, ref } from "vue";
import Dialog from "@/Dialog/Dialog.vue";
import { useViewStore } from "@/Views/viewStore";
import type { ViewProvider } from "@/viewProvider";
import ViewOptionRow from "./ViewOptionRow.vue";

const viewStore = useViewStore();

const viewUrl = ref("");
const addView = () => {
  viewStore.views.unshift({
    url: viewUrl.value,
    name: "View",
    capabilities: {
      edit: true,
      hoveringEvent: true,
      jumpToEvent: true,
      mobile: true,
    },
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" width="40" height="40" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
   <path d="M12 12l8 -4.5"></path>
   <path d="M12 12l0 9"></path>
   <path d="M12 12l-8 -4.5"></path>
</svg>`,
    uses: {
      jump: true,
      pages: true,
      sort: true,
      tags: true,
    },
  });
  viewStore.selectedViewIndex = 0;
  viewStore.showingViewsDialog = false;
};

const isActiveView = (v: ViewProvider) => {
  const index = viewStore.views.findIndex(
    (vo) => vo.name === v.name && v.url === vo.url
  );
  return index;
};

const toggleView = (v: ViewProvider) => {
  const index = isActiveView(v);
  if (index < 0) {
    viewStore.views.unshift(v);
  } else if (viewStore.views.length > 1) {
    viewStore.views.splice(index, 1);
  }
};
</script>

<template>
  <Dialog v-model="viewStore.showingViewsDialog">
    <template #header>
      <div
        class="p-2 flex flex-row items-center dark:text-white text-gray-800 font-bold"
      >
        Views
      </div></template
    >
    <div class="w-full flex px-2 mb-1 flex-col">
      <ViewOptionRow
        v-for="view in viewStore.viewOptions"
        :vp="view"
        :is-active="isActiveView(view) >= 0"
        @click="toggleView(view)"
      ></ViewOptionRow>
    </div>
    <form class="w-full flex px-2 pb-2 flex-col" @submit.prevent="addView">
      <div class="w-full flex flex-row gap-1">
        <input
          ref="input"
          type="text"
          placeholder="http://localhost:5000"
          v-model="viewUrl"
          class="w-full py-1 px-2 outline-none rounded-t dark:bg-gray-700 font-bold dark:text-white bg-gray-100"
          required
        />
        <button
          role="button"
          type="button"
          class="rounded px-2 ml-auto dark:bg-gray-700 dark:text-white font-bold"
          @click.prevent="addView"
        >
          Add
        </button>
      </div>
    </form>
    <div class="flex flex-row w-full pb-2 px-2">
      <div class="flex flex-row ml-auto">
        <button
          role="button"
          type="button"
          class="rounded px-2 ml-auto dark:bg-gray-700 dark:text-white font-bold"
          @click.prevent="viewStore.showingViewsDialog = false"
        >
          Done
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
