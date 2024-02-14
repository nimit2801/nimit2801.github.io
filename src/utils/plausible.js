import { createPlausible } from 'v-plausible/vue'

const plausible = createPlausible({
  init: {
    domain: 'nimitsavant.me',
    apiHost: 'https://ana.idta.in/stats',
    trackLocalhost: true,
  },
  settings: {
    enableAutoOutboundTracking: true,
    enableAutoPageviews: true,
  },
  partytown: false,
})

export default plausible;