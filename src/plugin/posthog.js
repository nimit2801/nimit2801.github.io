//./plugins/posthog.js
import posthog from 'posthog-js'

export default {
  install(app) {
    posthog.init('phc_gsKb3sevQd49YlPYyd1S0gZKHZIYG7WqXJAPaHBJviK', {
      api_host: 'https://eu.i.posthog.com',
      defaults: '2025-11-30',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })

    app.config.globalProperties.$posthog = posthog
  }
}