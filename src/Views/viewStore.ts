import { useViewProviders } from "@/App/composables/useViewProviders";
import type { ViewProvider } from "@/viewProvider";
import { defineStore } from "pinia";

export const useViewStore = defineStore('views', {
  state: () => ({
    selectedViewIndex: 0,
    views: useViewProviders()
  }),
  getters: {
    currentView(): ViewProvider {
      return this.views[this.selectedViewIndex];
    }
  }
})