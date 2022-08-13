import { useViewProviders } from "@/App/composables/useViewProviders";
import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";

const views = useViewProviders()
export const useViewStore = defineStore("views", {
  state: () => ({
    selectedViewIndex: 0,
  }),
  getters: {
    currentView(): ViewProvider {
      return views[this.selectedViewIndex]
    },
  },
});
