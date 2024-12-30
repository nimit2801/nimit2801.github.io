//./plugins/posthog.js
import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      "phc_6g0QHwbIOxR5fZKXYNnwz4N2WX2ARYl50gL003qZYcb",
      {
        api_host: "https://us.i.posthog.com",
      }
    );
  },
};
