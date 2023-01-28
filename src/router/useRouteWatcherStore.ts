import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTransformStore, type Sort } from "@/Markwhen/transformStore";
import { useViewStore } from "@/Views/viewStore";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePageStore } from "../Markwhen/pageStore";

export type RouteWatchState = "idle" | "error" | "loading";

export const useRouteWatcherStore = defineStore("routeWatcher", () => {
  const route = useRoute();
  const markwhenStore = useMarkwhenStore();
  const watchState = ref<RouteWatchState>("loading");
  const pageStore = usePageStore();
  const viewStore = useViewStore();
  const transformStore = useTransformStore();

  const pageTitles = computed(() => {
    return markwhenStore.timelines.map((t) => t.metadata.title);
  });

  const pageIndexFromQuery = (index: string) => {
    console.log("set page index", index);
    if (typeof index === "string") {
      const parsed = parseInt(index);
      if (isNaN(parsed)) {
        for (let i = 0; i < pageTitles.value.length; i++) {
          if (pageTitles.value[i] === decodeURIComponent(index)) {
            return i;
          }
        }
      } else if (parsed >= 0 && parsed < pageTitles.value.length) {
        return parsed;
      }
    } else if (
      typeof index === "number" &&
      index >= 0 &&
      index < pageTitles.value.length
    ) {
      return index;
    }
  };

  // query
  watchEffect(() => {
    if (route.query.page) {
      const index = pageIndexFromQuery(route.query.page as string);
      if (typeof index === "number") {
        pageStore.setPageIndex(index);
      }
    }
    if (route.query.view) {
      for (let i = 0; i < viewStore.views.length; i++) {
        if (
          (route.query.view as string).toLowerCase() ===
          viewStore.views[i].name.toLowerCase()
        ) {
          viewStore.setSelectedViewIndex(i);
        }
      }
    }
    const sort = (route.query.sort as string)?.toLowerCase();
    for (const s of ["none", "up", "down"] as Sort[]) {
      if (sort === s) {
        transformStore.setSort(sort);
      }
    }
    const filters = (route.query.filter as string)?.split(",") || [];
    for (const filter of filters) {
      transformStore.addFilterTag(filter);
    }
  });

  return {
    watchState,
  };
});
