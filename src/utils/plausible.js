import { createPlausible } from 'v-plausible/vue'

const plausible = createPlausible({
  init: {
    domain: 'nimitsavant.me',
    apiHost: 'https://ana.idta.in',
    trackLocalhost: true,
  },
  settings: {
    enableAutoOutboundTracking: true,
    enableAutoPageviews: true,
  },
  partytown: true,
})

export default plausible;