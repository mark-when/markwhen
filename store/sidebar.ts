import { MutationTree } from "vuex"
export type SelectedComponent = "" | "editor" | "profile"

interface State {
  selectedComponent: SelectedComponent
}

export const state: () => State = () => ({
  selectedComponent: ''
})

export const mutations: MutationTree<State> = {
  setSelectedComponent(state: State, component: SelectedComponent) {
    if (state.selectedComponent === component) {
      state.selectedComponent = ''
    } else {
      state.selectedComponent = component
    }
  }
}