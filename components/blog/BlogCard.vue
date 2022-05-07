<template>
  <a class="flex flex-row transition rounded-lg group" :href="doc.path">
    <div
      class="
        flex-shrink
        w-1/2
        group-hover:opacity-100
        opacity-10
        transition
        flex
        items-center
        justify-start
      "
      :class="{ 'order-1': isLeft, 'order-2': !isLeft }"
    >
      <div class="flex flex-col h-full">
        <div class="bg-black w-2 h-full relative">
          <div
            class="rounded-full h-4 w-4 bg-black absolute bottom-0"
            style="transform: translateX(-25%) translateY(25%)"
          ></div>
        </div>
        <div class="w-2 h-full" :class="!isLast ? 'bg-black' : ''"></div>
      </div>
      <div class="ml-8">
        <img
          v-if="false"
          class="object-cover h-full w-auto"
          :class="isLeft ? 'ml-auto' : ''"
          :src="doc.image"
          :alt="doc.description ? doc.description : ''"
        />
      </div>
    </div>
    <div
      class="flex flex-col w-1/2 p-2 justify-center m-6"
      :class="isLeft ? 'ml-auto order-2' : 'text-right items-end order-1'"
    >
      <div>
        <h3 class="text-3xl hover:underline transition font-bold mb-1">
          {{ doc.title }}
        </h3>
      </div>
      <h6 class="text-gray-400">{{ doc.date }}</h6>
      <p v-if="doc.description" class="text-gray-600">
        {{ doc.description }}
      </p>
    </div>
  </a>
</template>

<script lang="ts">
import Vue from "vue";
import VImg from "~/components/blog/VImg.vue";

export default Vue.extend({
  components: { VImg },
  props: ["index", "doc", "numPosts"],
  computed: {
    isLast(): boolean {
      return this.index === this.numPosts - 1;
    },
    isLeft(): boolean {
      return false;
    },
  },
});
</script>

<style>
</style>