import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.css";
import router from "./router";
import App from "@/App/App.vue";
import { createHead, useHead } from "@vueuse/head";

const app = createApp(App);
export const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(createHead());

app.mount("#app");
