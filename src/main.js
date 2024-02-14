import SimpleAnalytics from 'simple-analytics-vue';
import { createApp } from 'vue';
import plausible from './utils/plausible';
import App from './App.vue';

const app = createApp(App);
app.use(SimpleAnalytics, { skip: process.env.NODE_ENV !== 'production' });
app.use(plausible);
app.mount('#app');
