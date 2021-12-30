import { MutationTree } from "vuex"
export type SelectedComponent = "" | "editor" | "profile"

interface State {
  selectedComponent: SelectedComponent
  visible: boolean
}

export const state: () => State = () => ({
  selectedComponent: 'editor',
  visible: true
})

export const mutations: MutationTree<State> = {
  setSelectedComponent(state: State, component: SelectedComponent) {
    if (state.selectedComponent === component) {
      state.selectedComponent = ''
    } else {
      state.selectedComponent = component
    }
  },
  toggle(state: State) {
    state.visible = !state.visible
  }
}