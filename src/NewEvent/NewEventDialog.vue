<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useNewEventStore } from "./newEventStore";
import Dialog from "@/Dialog/Dialog.vue";
import RangePicker from "@/RangePicker/RangePicker.vue";
import { useMagicKeys } from "@vueuse/core";
import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
const newEventStore = useNewEventStore();

const datePickerOpen = ref(false);
const titleInput = ref<HTMLInputElement>();

const { meta, enter } = useMagicKeys();

const dialogShowing = computed({
  get() {
    return newEventStore.showing;
  },
  set(val: boolean) {
    newEventStore.setShowing(val);
  },
});

const newEventTitle = computed({
  get() {
    return newEventStore.title;
  },
  set(val: string) {
    newEventStore.setTitle(val);
  },
});

const newEventDetails = computed({
  get: () => newEventStore.details,
  set: (v) => newEventStore.setDetails(v),
});

const newEventRange = computed({
  get: () => newEventStore.range,
  set: (val) => newEventStore.setRange(val),
});

watch([meta, enter], ([pressingMeta, pressingEnter]) => {
  if (pressingMeta && pressingEnter) {
    save();
  }
});

const save = () => {
  dialogShowing.value = false;
  newEventStore.createEventWithValues();
};

const rangePickerToggled = (open: boolean) => {
  if (!open) {
    setTimeout(() => {
      datePickerOpen.value = open;
    }, 150);
  } else {
    datePickerOpen.value = open;
  }
};

watch(dialogShowing, (showing) => {
  if (showing) {
    nextTick(() => titleInput.value?.select());
  }
});
</script>

<template>
  <Dialog
    v-model="dialogShowing"
    id="newEventDialog"
    overflow="visible"
    :dismissable="!datePickerOpen"
  >
    <template #header
      ><div
        class="p-2 flex flex-row items-center dark:text-white text-gray-800 font-bold"
      >
        Create event
      </div></template
    >
    <div class="flex px-2 pb-2 flex-col">
      <form class="flex flex-col w-full" @submit.prevent="save">
        <input
          ref="titleInput"
          type="text"
          placeholder="Event title"
          v-model="newEventTitle"
          class="mb-1 w-full p-2 outline-none rounded dark:bg-gray-700 font-bold dark:text-white bg-gray-100 font-mono text-sm"
        />
        <RangePicker
          @is-open="rangePickerToggled"
          v-model="newEventRange"
        ></RangePicker>
        <textarea
          placeholder="Details"
          v-model="newEventDetails"
          class="w-full p-2 outline-none rounded dark:bg-gray-700 font-bold dark:text-white bg-gray-100 font-mono text-sm"
        ></textarea>
        <div class="flex flex-row w-full pt-2">
          <!-- <div
            class="dark:text-gray-400 text-gray-500 font-bold"
            v-if="name"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              whitespace: nowrap;
            "
          >
            markwhen.com{{ derivedPath }}
          </div> -->
          <div class="flex flex-row ml-auto">
            <button
              role="button"
              type="button"
              class="rounded px-2 ml-auto dark:bg-gray-700 dark:text-white font-bold"
              @click.prevent="dialogShowing = false"
            >
              Cancel</button
            ><button
              class="rounded px-2 dark:bg-indigo-200 bg-indigo-100 text-indigo-800 font-bold ml-2 flex flex-row items-center justify-center"
              role="submit"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<style></style>
