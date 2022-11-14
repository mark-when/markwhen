import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.css";

import App from "@/App/App.vue";

const app = createApp(App);
export const pinia = createPinia();

app.use(pinia);

app.mount("#app");
