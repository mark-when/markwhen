<script setup lang="ts">
import { computed, ref } from "vue";
import Dialog from "@/Dialog/Dialog.vue";
import { useViewStore } from "@/Views/viewStore";
import type { ViewProvider } from "@/viewProvider";
import ViewOptionRow from "./ViewOptionRow.vue";

const viewStore = useViewStore();

const viewUrl = ref("");
const addView = () => {
  viewStore.viewOptions.push({
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
    active: true,
  });
  viewStore.selectedViewIndex = 0;
  viewUrl.value = "";
};

const toggleView = (v: ViewProvider) => {
  if (!v.active) {
    viewStore.selectedViewIndex = 0;
    v.active = true;
  } else if (viewStore.views.length > 1) {
    viewStore.selectedViewIndex = 0;
    v.active = !v.active;
  }
};

const removeView = (v: ViewProvider) => {
  const index = viewStore.viewOptions.findIndex(
    (vo) => v.name === vo.name && v.url === vo.url
  );
  if (index >= 0) {
    viewStore.viewOptions.splice(index, 1);
  }
};
</script>

<template>
  <Dialog v-model="viewStore.showingViewsDialog">
    <template #header>
      <div
        class="p-2 flex flex-row items-center dark:text-white text-gray-800 font-bold pl-4"
      >
        Views
      </div></template
    >
    <div class="w-full flex px-2 mb-1 flex-col">
      <ViewOptionRow
        v-for="view in viewStore.viewOptions"
        :vp="view"
        :is-active="!!view.active"
        @click="toggleView(view)"
        @remove="removeView(view)"
      ></ViewOptionRow>
    </div>
    <form class="w-full flex px-2 pb-2 flex-col" @submit.prevent="addView">
      <div class="w-full flex flex-row gap-1">
        <input
          ref="input"
          type="text"
          placeholder="http://localhost:5000"
          v-model="viewUrl"
          class="w-full py-1 px-3 outline-none rounded dark:bg-gray-700 font-bold dark:text-white bg-gray-100"
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
