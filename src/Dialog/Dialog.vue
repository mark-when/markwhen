<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    dismissable?: boolean;
    overflow?: "scroll" | "visible";
    restrictHeight?: boolean;
  }>(),
  {
    modelValue: false,
    dismissable: true,
    overflow: "scroll",
    restrictHeight: true,
  }
);
const emit = defineEmits<{
  (event: "update:modelValue", open: boolean): void;
}>();
const dialog = ref<HTMLDialogElement>();
const closing = ref(false);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(isOpen) {
    emit("update:modelValue", isOpen);
  },
});

watch(open, (open) => {
  if (open) {
    dialog.value?.showModal();
  } else {
    closing.value = true;
    setTimeout(() => {
      closing.value = false;
      dialog.value?.close();
    }, 100);
  }
});
const close = () => {
  if (props.dismissable) {
    open.value = false;
  }
};
const click = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    if ((e.target as HTMLElement)?.nodeName === "DIALOG") {
      close();
    }
  } else if ((e.touches[0].target as HTMLElement).nodeName === "DIALOG") {
    close();
  }
};

const keydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
};
</script>

<template>
  <dialog
    ref="dialog"
    :style="restrictHeight ? `max-height: 60%` : ''"
    class="shadow-xl flex-col p-0 bg-slate-50 dark:bg-slate-900 safeBottomPadding dark:text-slate-50 text-gray-800"
    :class="{ closing, 'overflow-visible': overflow === 'visible' }"
    @click="click"
    @keydown="keydown"
  >
    <header class="flex flex-row">
      <slot name="header"></slot>
      <button
        v-if="dismissable"
        class="ml-auto rounded bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white p-1 m-2 hover:bg-gray-200 transition"
        @click="close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div class="p-1 m-2 ml-auto" v-else>
        <div class="h-5 w-5"></div>
      </div>
    </header>
    <div
      class="rounded"
      :class="{
        'overflow-visible': overflow === 'visible',
        'overflow-scroll': overflow === 'scroll',
      }"
    >
      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  @apply bg-gray-400/25 dark:bg-gray-400/25;
  animation: fade-in 0.1s;
  animation-timing-function: ease-in-out;
}
dialog {
  @apply rounded;

  min-width: calc(min(400px, 100%));
  animation: fade-in-scale 0.1s;
  animation-timing-function: ease-in-out;
  opacity: 0;
}

dialog.closing::backdrop {
  animation: fade-out 0.1s;
}
dialog.closing {
  display: flex;
  animation: fade-out-scale 0.1s;
}
dialog[open] {
  display: flex;
  opacity: 1;
  scale: 1;
}
dialog:not([open]) {
  opacity: 0;
}

@keyframes fade-out-scale {
  from {
    opacity: 1;
    scale: 1;
  }
  to {
    opacity: 0;
    scale: 0.95;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-scale {
  from {
    opacity: 0;
    scale: 0.95;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
