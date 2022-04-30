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

  test("detects number of pages", () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2"
    );
    expect(store.getters.cascades.length).toBe(2);
  });

  test("deletes last page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2"
    );
    await store.dispatch("deletePage", 1);
    expect(store.state.eventsString).toBe("title: page 1\n");
  });

  test("deletes first page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
    await store.dispatch("deletePage", 0);
    expect(store.state.eventsString).toBe(
      "\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
  });

  test("deletes middle page", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
    await store.dispatch("deletePage", 1);
    expect(store.state.eventsString).toBe(
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 3"
    );
  });

  test("swaps same page does nothing", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n"
    );
    await store.dispatch("movePages", { from: 0, to: 0 });
    expect(store.state.eventsString).toBe(
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n"
    );
  });

  test("swaps only two pages 1", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "\ntitle: page 1\n\n_-_-_break_-_-_\n\ntitle: second page\n"
    );
    await store.dispatch("movePages", { from: 0, to: 1 });
    expect(store.state.eventsString).toBe(
      "\ntitle: second page\n\n_-_-_break_-_-_\n\ntitle: page 1\n"
    );
  });

  test("swaps only two pages 0", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "\ntitle: page 1\n\n_-_-_break_-_-_\n\ntitle: second page\n"
    );
    await store.dispatch("movePages", { from: 1, to: 0 });
    expect(store.state.eventsString).toBe(
      "\ntitle: second page\n\n_-_-_break_-_-_\n\ntitle: page 1\n"
    );
  });

  test("swaps mid pages left to right", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3\n\n_-_-_break_-_-_\n\ntitle: page 4\n"
    );
    await store.dispatch("movePages", { from: 1, to: 2 });
    expect(store.state.eventsString).toBe(
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 3\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 4\n"
    );
  });

  test("swaps mid pages right to left", async () => {
    store.commit(
      MUTATION_SET_EVENTS_STRING,
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 3\n\n_-_-_break_-_-_\n\ntitle: page 4\n"
    );
    await store.dispatch("movePages", { from: 2, to: 1 });
    expect(store.state.eventsString).toBe(
      "title: page 1\n\n_-_-_break_-_-_\n\ntitle: page 3\n\n_-_-_break_-_-_\n\ntitle: page 2\n\n_-_-_break_-_-_\n\ntitle: page 4\n"
    );
  });
});
