import SimpleAnalytics from "simple-analytics-vue";
import { createApp } from "vue";
import plausible from "./utils/plausible";
import App from "./App.vue";
import posthogPlugin from "./plugin/posthog.js";
import router from "./router/index.ts";

const app = createApp(App);
app.use(SimpleAnalytics, { skip: process.env.NODE_ENV !== "production" });
app.use(plausible);
app.use(router);
app.use(posthogPlugin);
app.mount("#app");
