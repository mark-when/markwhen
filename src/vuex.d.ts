import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    list: string[],
    currentTimelineName: string,
    settings: {
      yearWidth: number
    },
    filter: Set<string>
    eventsString: string | null
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}