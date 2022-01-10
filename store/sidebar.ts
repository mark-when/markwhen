import { MutationTree } from "vuex"
export type SelectedComponent = "" | "editor" | "profile" | 'howto'
export type Side = "left" | "right"

interface State {
  selectedComponent: SelectedComponent
  visible: boolean
  position: Side
}

export const state: () => State = () => ({
  selectedComponent: 'editor',
  visible: true,
  position: 'left'
})

export const mutations: MutationTree<State> = {
  setSelectedComponent(state: State, component: SelectedComponent) {
    if (state.selectedComponent === component) {
      state.selectedComponent = ''
    } else {
      state.selectedComponent = component
    }
  },
  setPosition(state: State, side: Side) {
    state.position = side
  },
  togglePosition(state: State) {
    state.position = state.position === 'left' ? 'right' : 'left'
  },
  toggle(state: State) {
    state.visible = !state.visible
  }
}