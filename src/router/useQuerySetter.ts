import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { usePageStore } from "../Markwhen/pageStore";
import { useViewStore } from "../Views/viewStore";
import { useTransformStore } from "@/Markwhen/transformStore";

export const useQuerySetter = () => {
  const route = useRoute();
  const pageStore = usePageStore();
  const viewStore = useViewStore();
  const transformStore = useTransformStore();

  const currentViewName = computed(() => viewStore.currentView.name);

  const queryMap = computed(() => ({
    page: `${pageStore.pageIndex}`,
    view: currentViewName.value,
    sort: transformStore.sort,
    filter: transformStore.filter.join(","),
  }));

  const computedQuery = computed(() => new URLSearchParams(queryMap.value));

  const currentQueryMap = computed(() => new URLSearchParams(route.query));
};
