import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { MUTATION_SET_EVENTS_STRING, state } from "~/store/index";
import { buildVuexFromNuxt } from "./store";
import * as rootStore from "~/store/index";

describe("store", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let store: Store<ReturnType<typeof state>>;

  beforeEach(async () => {
    store = new Vuex.Store(buildVuexFromNuxt(rootStore));
  });

  test("Can set events string", async () => {
    store.commit(MUTATION_SET_EVENTS_STRING, "ok");
    expect(store.state.eventsString).toBe("ok");
  });

  test("Correctly detects number of pages", () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2"
    );
    expect(store.getters.cascades.length).toBe(2);
  });

  test("Correctly deletes last page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2"
    );
    await store.dispatch("deletePage", 1);
    expect(store.state.eventsString).toBe("title: page 1\n");
  });

  test("Correctly deletes first page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
    await store.dispatch("deletePage", 0);
    expect(store.state.eventsString).toBe(
      "\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
  });

  test("Correctly deletes middle page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
    await store.dispatch("deletePage", 1);
    expect(store.state.eventsString).toBe(
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
  });
});
