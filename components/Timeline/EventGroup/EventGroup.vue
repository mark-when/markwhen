<template>
  <div>
    <expanded
      v-if="expanded"
      :eventGroup="eventGroup"
      :left="left"
      :hovering="hovering"
      :canCalculateButton="canCalculateButton"
      @hovering="hovering = $event"
      @collapse="expanded = !expanded"
    />
    <CollapsedGroup
      v-if="!expanded && isGroupStyleTight"
      :eventGroup="eventGroup"
      :left="left"
      @expand="expand"
    />
    <collapsed-section
      v-if="!expanded && !isGroupStyleTight"
      :eventGroup="eventGroup"
      @expand="expand"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EventRow from "../EventRow.vue";
import { mapGetters } from "vuex";
import Expanded from "./Expanded.vue";
import CollapsedGroup from "./CollapsedGroup.vue";
import CollapsedSection from "./CollapsedSection.vue";

export default Vue.extend({
  components: { EventRow, Expanded, CollapsedGroup, CollapsedSection },
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
        this.canCalculateButton = val;
      });
    },
  },
  mounted() {
    this.canCalculateButton = this.expanded;
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
    isGroupStyleTight(): boolean {
      return this.eventGroup.style === "group";
    },
    left(): number {
      if (!this.eventGroup || !this.eventGroup.range) {
        return 10;
      }
      return this.distanceFromBaselineLeftmostDate(this.eventGroup.range.min);
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