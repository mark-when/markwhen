<template>
  <button
    class="
      h-6
      rounded-full
      border-2
      mr-2
      flex
      items-center
      justify-center
      flex-shrink-0
      relative
    "
    :style="style"
    @mouseover="startHover"
    @mouseleave="endHover"
    @mousedown.stop="startMoving"
    @touchdown.stop="startMoving"
    @click="click"
    :class="`${
      index === $store.state.cascadeIndex
        ? 'border-blue-300 bg-blue-50 dark:bg-slate-600 dark:border-slate-500'
        : 'border-white bg-white hover:bg-blue-50 border-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600'
    } ${cascadeTitle ? '' : 'w-6'} ${shadowed ? 'shadow' : ''}`"
  >
    <button
      class="
        absolute
        right-0
        top-0
        -translate-y-1/2
        translate-x-1/2
        text-slate-300
        hover:text-slate-500
        dark:text-slate-500 dark:hover:text-slate-300
        rounded-full
        dark:bg-slate-700
        bg-slate-100
      "
      @click.prevent.stop="del"
      v-if="
        $store.state.editable && $store.getters.cascades.length > 1 && hovering
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <h3
      v-if="cascadeTitle"
      class="px-3 font-bold text-gray-500 dark:text-gray-300"
    >
      {{ cascadeTitle }}
    </h3>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Cascade } from "~/src/Types";

export default Vue.extend({
  props: ["cascade", "index", "shadowed", "translate"],
  data() {
    return {
      softHover: false,
      hovering: false,
      timer: undefined as number | undefined,
      startX: undefined as number | undefined,
      translateX: 0,
    };
  },
  computed: {
    style(): string {
      if (this.translateX !== 0) {
        return `transform: translateX(${this.translateX}px); z-index: 20;`;
      }
      if (this.translate) {
        return `transform: translateX(${this.translate}px)`;
      }
      return "transform: translateX(0px)";
    },
    cascadeTitle() {
      const c = this.cascade as Cascade;
      return (c && c.metadata && c.metadata.title) || "";
    },
  },
  watch: {
    translateX(val) {
      this.$emit("moving", val);
    },
  },
  methods: {
    click() {
      this.$store.commit("setCascadeIndex", this.index);
    },
    stopMoving() {
      this.startX = undefined;
      this.translateX = 0;
      document.removeEventListener("mousemove", this.moveListener);
      document.removeEventListener("touchmove", this.moveListener);
      document.removeEventListener("mouseup", this.endMoveListener);
      document.removeEventListener("touchend", this.endMoveListener);
      document.removeEventListener("keydown", this.escapeListener);
    },
    moveListener(e: MouseEvent | TouchEvent) {
      // Since we're moving, cancel any hover timer we had
      if (this.timer || this.hovering || this.softHover) {
        clearTimeout(this.timer);
        this.timer = undefined;
        this.hovering = false;
        this.softHover = false;
      }
      const el = this.$el as HTMLButtonElement;

      // We shouldn't go any further than the start of the parent element
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const diff = clientX - this.startX!;
      const parentOffsetLeft = el.parentElement?.offsetLeft || 0;
      const addPageButtonWidth = 20;
      const maxRight =
        el.parentElement!.scrollWidth -
        el.offsetLeft -
        el.clientWidth -
        addPageButtonWidth;
      this.translateX = Math.min(
        Math.max(-el.offsetLeft + parentOffsetLeft, diff),
        maxRight
      );
    },
    endMoveListener(e: MouseEvent | TouchEvent) {
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      if (Math.abs(clientX - this.startX!) > 2) {
        document.addEventListener("click", this.captureClick, true);
      }
      this.$emit("doneMoving");
      this.stopMoving();
    },
    captureClick(e: MouseEvent) {
      e.stopPropagation();
      document.removeEventListener("click", this.captureClick, true);
    },
    escapeListener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        this.stopMoving();
      }
    },
    startMoving(e: MouseEvent | TouchEvent) {
      if (!this.$store.state.editable) {
        return;
      }
      this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      document.addEventListener("touchmove", this.moveListener);
      document.addEventListener("mousemove", this.moveListener);
      document.addEventListener("touchend", this.endMoveListener);
      document.addEventListener("mouseup", this.endMoveListener);
      document.addEventListener("keydown", this.escapeListener);
    },
    del() {
      if (confirm(`Delete ${this.cascadeTitle || "this page"}?`)) {
        this.$store.dispatch("deletePage", this.index);
      }
    },
    endHover() {
      this.softHover = false;
      this.hovering = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    },
    startHover() {
      if (!this.timer) {
        const vm = this;
        vm.softHover = true;
        // @ts-ignore
        this.timer = setTimeout(() => {
          if (vm.softHover) {
            vm.hovering = true;
          }
        }, 750);
      }
    },
  },
});
</script>

<style>
</style>