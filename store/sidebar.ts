import { MutationTree, GetterTree } from "vuex";
export type SelectedComponent =
  | ""
  | "editor"
  | "profile"
  | "howto"
  | "explore"
  | "settings";
export type Side = "left" | "right";
export type DarkMode = "system" | "dark" | "light";

interface State {
  selectedComponent: SelectedComponent;
  visible: boolean;
  position: Side;
  resizeYStarted: boolean;
  resizeStartY: number;
  heightDiff: number;
  sidebarHeight: number;
  darkMode: DarkMode;
  width: number;
}

export const state: () => State = () => ({
  selectedComponent: "editor",
  visible: true,
  position: "left",
  resizeYStarted: false,
  resizeStartY: 0,
  heightDiff: 0,
  sidebarHeight: 300,
  darkMode: "system",
  width: 350,
});

export const mutations: MutationTree<State> = {
  setWidth(state: State, width: number) {
    state.width = width;
  },
  checkDarkMode(state: State) {
    if (typeof window === "undefined" || !window) {
      return;
    }
    if (localStorage.theme === "dark") {
      state.darkMode = "dark";
    } else if (localStorage.theme === "light") {
      state.darkMode = "light";
    } else {
      state.darkMode = "system";
    }
  },
  toggleDarkMode(state: State) {
    if (state.darkMode === "system") {
      state.darkMode = "dark";
      localStorage.theme = "dark";
    } else if (state.darkMode === "dark") {
      localStorage.theme = "light";
      state.darkMode = "light";
    } else {
      localStorage.removeItem("theme");
      state.darkMode = "system";
    }
  },
  setDarkMode(state: State, darkMode: DarkMode) {
    state.darkMode = darkMode;
  },
  setSelectedComponent(state: State, component: SelectedComponent) {
    if (state.selectedComponent === component) {
      state.selectedComponent = "";
    } else {
      state.selectedComponent = component;
    }
  },
  setPosition(state: State, side: Side) {
    state.position = side;
    if (typeof localStorage !== "undefined") {
      localStorage.sidebarSide = side;
    }
  },
  togglePosition(state: State) {
    state.position = state.position === "left" ? "right" : "left";
    if (typeof localStorage !== "undefined") {
      localStorage.sidebarSide = state.position;
    }
  },
  toggle(state: State) {
    state.visible = !state.visible;
  },
  startResizeY(state: State, startY: number) {
    state.resizeYStarted = true;
    state.heightDiff = 0;
    state.resizeStartY = startY;
  },
  resizeY(state: State, height: number) {
    state.heightDiff = state.resizeStartY - height;
  },
  endResizeY(state: State) {
    if (state.heightDiff === 0) {
      state.visible = !state.visible;
    }
    state.resizeYStarted = false;
  },
  setHeight(state: State, sidebarHeight: number) {
    state.sidebarHeight = sidebarHeight;
  },
};

export const getters: GetterTree<State, State> = {
  darkMode(state, getters) {
    if (state.darkMode !== "system") {
      return state.darkMode;
    }
    if (typeof window === "undefined" || !window) {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },
};
