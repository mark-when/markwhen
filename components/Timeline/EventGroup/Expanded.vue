<template>
  <div class="relative flex flex-col">
    <div
      class="
        absolute
        h-full
        flex flex-row
        items-center
        dark:text-gray-400
        transition
      "
      :class="expandedGroupClass"
      :style="expandedGroupStyle"
    ></div>
    <div
      :style="`margin-left: ${left}px; width: ${this.fullWidth}px;`"
      class="sticky top-8 cursor-pointer"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    ></div>
    <event-row
      v-for="event in eventGroup"
      :key="event.eventString.substring(0, 30)"
      :event="event"
    ></event-row>
    <div
      :style="
        isGroupStyleTight
          ? `margin-left: ${left}px; width: ${this.fullWidth}px; order: -9999;`
          : `order: -9999`
      "
      class="sticky top-10 cursor-pointer"
      @click="$emit('collapse')"
      @mouseover="$emit('hovering', true)"
      @mouseleave="$emit('hovering', false)"
    >
      <button
        ref="button"
        class="
          flex flex-row
          items-center
          sticky
          px-1
          mt-px
          dark:bg-opacity-60
          bg-opacity-20
        "
        :class="buttonClass"
        :style="buttonStyle"
        @mouseover="$emit('hovering', true)"
        @mouseleave="$emit('hovering', false)"
        @click="$emit('collapse')"
      >
        <div class="flex flex-row flex-grow items-center justify-center">
          <span class="eventTitle" v-if="eventGroup.title" v-html="titleHtml">
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-auto"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventDescription } from "~/src/Types";
import EventRow from "../EventRow.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { EventRow },
  props: ["eventGroup", "left", "hovering", "canCalculateButton"],
  computed: {
    ...mapGetters(["distanceBetweenDates"]),
    buttonClass(): string {
      return `${this.bgColorClass} ${
        this.isGroupStyleTight ? "rounded-lg" : ""
      }`;
    },
    buttonStyle(): string {
      const background = this.rgb
        ? `background-color: rgba(${this.rgb}, 0.15); `
        : "";
      return this.isGroupStyleTight
        ? `left: calc(50% - ${this.buttonWidth / 2}px); ${background}`
        : `left: 1rem; ${background}`;
    },
    buttonWidth(): number {
      // This whole thing is slightly messed up.
      // We want the button title to be centered in the viewport, however we can't
      // use tranform: translateX(-50%) as it will put the button outside its containing div.
      // So we're just going to set it programmatically. However we need to wait to make sure the button
      // exists before we get its width, that's what canCalculateButton is for.
      // We also need Vue to depend on the event's title for this width aspect,
      // that's why there's this otherwise superfluous line that doesn't use `title`.
      const title = this.eventGroup.title;
      if (this.canCalculateButton) {
        return (this.$refs.button as HTMLButtonElement).clientWidth;
      }
      return 0;
    },
    titleHtml(): string {
      return EventDescription.toInnerHtml(this.eventGroup.title);
    },
    isGroupStyleTight(): boolean {
      return this.eventGroup.style === "group";
    },
    bgColorClass(): string {
      if (!this.bgColorStyle) {
        return `bg-gray-400 dark:bg-gray-800`;
      }
      return "";
    },
    rgb(): string {
      const tags = this.eventGroup.tags;
      if (tags && tags.length) {
        const tag = tags[0];
        return this.$store.getters.tags[tag] || "";
      }
      return "";
    },
    bgColorStyle(): string {
      return this.rgb
        ? `background-color: rgba(${this.rgb}, ${
            this.hovering ? "0.09" : "0.05"
          })`
        : "";
    },
    expandedGroupStyle(): string {
      if (this.isGroupStyleTight) {
        const leftMargin = this.left;
        return `margin-left: ${leftMargin - 8}px; width: max(64px, ${
          this.fullWidth + 16
        }px); ${this.bgColorStyle}; `;
      }
      return `${this.bgColorStyle}; `;
    },
    expandedGroupClass(): string {
      return `${
        this.hovering
          ? "dark:bg-opacity-30 bg-opacity-20"
          : "dark:bg-opacity-20 bg-opacity-10"
      } ${this.bgColorClass} ${
        this.isGroupStyleTight ? "rounded-lg" : "ml-0 w-full"
      }`;
    },
    fullWidth(): number {
      if (!this.eventGroup || !this.eventGroup.range) {
        return 100;
      }
      return this.distanceBetweenDates(
        this.eventGroup.range.min,
        this.eventGroup.range.latest
      );
    },
  },
});
</script>

<style>
</style>