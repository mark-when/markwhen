<template>
  <div
    class="flex flex-row overflow-x-scroll pages pb-1 pt-2"
    style="--webkit-overflow-scrolling: touch"
  >
    <cascade-button
      v-for="(cascade, index) in $store.getters.cascades"
      :key="index"
      :index="index"
      :cascade="cascade"
      :shadowed="shadowed"
      :translate="translations[index]"
      @moving="moving(index, $event)"
      @doneMoving="doneMoving"
      ref="buttons"
    />
    <button
      v-if="$store.state.editable"
      class="
        w-6
        h-6
        rounded-full
        border-2
        mr-2
        flex
        items-center
        justify-center
        transition
        border-white
        bg-white
        hover:bg-blue-50
        border-blue-100
        text-gray-500
        dark:text-gray-300
        dark:bg-slate-700
        dark:hover:bg-slate-600
        dark:border-slate-600
        flex-shrink-0
      "
      :class="shadowed ? 'shadow' : ''"
      @click="addNewPage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { cascade } from "~/src/codeMirrorParser";
import CascadeButton from "./CascadeButton.vue";

export default Vue.extend({
  components: { CascadeButton },
  props: ["shadowed"],
  data() {
    return {
      translations: {} as { [index: number]: number },
      moveFrom: undefined as number | undefined,
      moveTo: undefined as number | undefined,
    };
  },
  methods: {
    doneMoving() {
      this.$store.dispatch("movePages", {
        from: this.moveFrom,
        to: this.moveTo,
      });
      this.moveFrom = undefined;
      this.moveTo = undefined;
    },
    addNewPage() {
      this.$store.dispatch("addNewPage");
    },
    moving(cascadeIndex: number, translationAmount: number) {
      this.moveFrom = cascadeIndex;
      const positions = (this.$refs.buttons as Vue[]).map((b) => {
        const from = (b.$el as HTMLButtonElement).offsetLeft;
        const to = (b.$el as HTMLButtonElement).offsetLeft + b.$el.clientWidth;
        return {
          from,
          to,
          midpoint: (to + from) / 2,
        };
      });

      // If right side overtakes midpoint of right neighbor
      // or if left side overtakes midpoint of left neighbor

      const movingButton = positions[cascadeIndex];
      const newRightEdge = movingButton.to + translationAmount;
      const newLeftEdge = movingButton.from + translationAmount;
      let leftOf = positions.length - 1;
      let rightOf = 0;
      for (let i = 0; i < positions.length; i++) {
        const buttonPosition = positions[i];
        if (newRightEdge > buttonPosition.midpoint) {
          rightOf = Math.max(i, rightOf);
        }
        if (newLeftEdge < buttonPosition.midpoint) {
          leftOf = Math.min(leftOf, i);
        }
      }
      const newIndex =
        translationAmount < 0
          ? Math.min(leftOf, rightOf)
          : Math.max(leftOf, rightOf);

      this.moveTo = newIndex;

      // We only need to change elements that are between `newIndex` and `cascadeIndex`
      const rangeStart = Math.min(newIndex, cascadeIndex);
      const rangeEnd = Math.max(newIndex, cascadeIndex);
      const padding = 8;
      for (let i = 0; i < positions.length; i++) {
        if (i >= rangeStart && i <= rangeEnd) {
          if (i === cascadeIndex) {
            continue;
          }
          if (i > cascadeIndex) {
            Vue.set(
              this.translations,
              i,
              -(movingButton.to - movingButton.from + padding)
            );
          } else {
            Vue.set(
              this.translations,
              i,
              movingButton.to - movingButton.from + padding
            );
          }
        } else {
          Vue.set(this.translations, i, 0);
        }
      }
    },
  },
});
</script>

<style>
.pages::-webkit-scrollbar {
  display: none;
}
</style>