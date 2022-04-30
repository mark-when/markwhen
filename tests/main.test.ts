import Vuex from "vuex"
import { createLocalVue } from "@vue/test-utils"

describe("store", () => {
// ----------------------------------------------------
// focus on the code from here...
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let NuxtStore
  let store

  beforeAll(async () => {
    // note the store will mutate across tests
    const storePath = `${process.env.buildDir}/store.js`
    NuxtStore = await import(storePath)
  })


  beforeEach(async () => {
    store = await NuxtStore.createStore()
  })

  test("example", () => {

  })

})