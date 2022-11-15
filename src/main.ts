import { createApp } from "vue";
import { createPinia } from "pinia";
import { vscodeApi } from "./VSCode/composables/useVsCode"
import "./index.css";

import App from "@/App/App.vue";
import { createHead, useHead } from "@vueuse/head";

export const pinia = createPinia();
const previousState = null // vscode.getState() as Recode<string, any>;
if (previousState) {
  console.log("applying previous state", previousState)
  pinia.state.value = previousState
}
const app = createApp(App);

app.use(pinia);
app.use(createHead())

app.mount("#app");
