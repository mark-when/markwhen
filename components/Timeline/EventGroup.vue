<template>
  <div>
    <div v-if="expanded" class="relative flex flex-col">
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
        @click="collapse"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
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
        @click="collapse"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
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
          :style="
            isGroupStyleTight
              ? `left: calc(50% - ${buttonWidth / 2}px)`
              : 'left: 1rem'
          "
          @mouseover="hovering = true"
          @mouseleave="hovering = false"
          @click="collapse"
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
    <div
      v-if="!expanded && isGroupStyleTight"
      :style="collapsedGroupStyle"
      :class="collapsedGroupClass"
      class="
        border border-gray-400
        dark:border-gray-600
        rounded-full
        eventTitle
        transition
        bg-opacity-10
        hover:bg-opacity-30
      "
    >
      <button class="w-full" @click="expand">
        <span v-if="eventGroup.title" v-html="titleHtml"></span>
        ({{ eventGroup.length }})
      </button>
    </div>
    <div
      v-if="!expanded && !isGroupStyleTight"
      class="
        dark:border-gray-600
        eventTitle
        transition
        bg-opacity-30
        hover:bg-opacity-40
        cursor-pointer
      "
      :class="collapsedGroupClass"
      @click="expand"
    >
      <div class="flex">
        <div class="sticky left-4 px-1 mt-px">
          <span class="" v-if="eventGroup.title" v-html="titleHtml"></span>
          ({{ eventGroup.length }})
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EventRow from "./EventRow.vue";
import { mapGetters } from "vuex";
import { COLORS } from "~/src/Parser";
import { EventDescription } from "~/src/Types";

export default Vue.extend({
  components: { EventRow },
  props: ["eventGroup"],
  data() {
    return {
      expanded: !!this.eventGroup.startExpanded,
      hovering: false,
      canCalculateButton: false,
    };
  },
  watch: {
    expanded(val) {
      Vue.nextTick(() => {
        console.log("setting canCalculateButton");
        this.canCalculateButton = val;
      });
    },
  },
  mounted() {
    this.canCalculateButton = this.expanded;
  },
  computed: {
    titleHtml(): string {
      return EventDescription.toInnerHtml(this.eventGroup.title);
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
    isGroupStyleTight(): boolean {
      return this.eventGroup.style === "group";
    },
    ...mapGetters([
      "distanceFromBaselineLeftmostDate",
      "distanceBetweenDates",
      "metadata",
    ]),
    collapsedGroupStyle(): string {
      const leftMargin = this.left;
      let style = `margin-left: ${leftMargin - 8}px; width: max(64px, ${
        this.fullWidth + 16
      }px); `;
      return style;
    },
    collapsedGroupClass(): string {
      return this.bgColorClass;
    },
    expandedGroupStyle(): string {
      if (this.isGroupStyleTight) {
        const leftMargin = this.left;
        return `margin-left: ${leftMargin - 8}px; width: max(64px, ${
          this.fullWidth + 16
        }px);`;
      }
      return "";
    },
    buttonClass(): string {
      return `${this.bgColorClass} ${
        this.isGroupStyleTight ? "rounded-lg" : ""
      }`;
    },
    bgColorClass(): string {
      const tags = this.eventGroup.tags;
      let c = "";
      if (tags && tags.length) {
        const tag = tags[0];
        if (this.$store.getters.tags[tag]) {
          if (COLORS.includes(this.$store.getters.tags[tag])) {
            c += `bg-${this.$store.getters.tags[tag].toLowerCase()}-800`;
          }
        } else {
          c += `bg-gray-800`;
        }
      } else {
        c += "bg-gray-800";
      }
      return c;
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
    left(): number {
      if (!this.eventGroup || !this.eventGroup.range) {
        return 10;
      }
      return this.distanceFromBaselineLeftmostDate(this.eventGroup.range.min);
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
  methods: {
    expand() {
      this.expanded = true;
    },
    collapse(e: MouseEvent) {
      if (e.target instanceof HTMLAnchorElement) {
        return;
      }
      e.preventDefault();
      this.expanded = false;
    },
  },
});
</script>

<style>
</style>