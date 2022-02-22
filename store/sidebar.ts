import { MutationTree } from "vuex"
export type SelectedComponent = "" | "editor" | "profile" | 'howto' | 'explore'
export type Side = "left" | "right"

interface State {
  selectedComponent: SelectedComponent
  visible: boolean
  position: Side
  resizeYStarted: boolean
  resizeStartY: number
  heightDiff: number
  sidebarHeight: number
}

export const state: () => State = () => ({
  selectedComponent: 'editor',
  visible: true,
  position: 'left',
  resizeYStarted: false,
  resizeStartY: 0,
  heightDiff: 0,
  sidebarHeight: 300
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
  },
  startResizeY(state: State, startY: number) {
    state.resizeYStarted = true
    state.heightDiff = 0
    state.resizeStartY = startY
  },
  resizeY(state: State, height: number) {
    state.heightDiff = state.resizeStartY - height
  },
  endResizeY(state: State) {
    if (state.heightDiff === 0) {
      state.visible = !state.visible
    }
    state.resizeYStarted = false
  },
  setHeight(state: State, sidebarHeight: number) {
    state.sidebarHeight = sidebarHeight
  }
}