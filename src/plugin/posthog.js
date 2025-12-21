//./plugins/posthog.js
import posthog from 'posthog-js'

export default {
  install(app) {
    posthog.init('phc_gsKb3sevQd49YlPYyd1S0gZKHZIYG7WqXJAPaHBJviK', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We handle pageviews manually in the router
      debug: true, // Enable debug mode to see events in console
      loaded: () => {
        if (import.meta.env.DEV) {
          console.log('PostHog loaded successfully in dev mode')
        }
      }
    })

    app.config.globalProperties.$posthog = posthog
  }
}