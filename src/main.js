import SimpleAnalytics from 'simple-analytics-vue';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(SimpleAnalytics, { skip: process.env.NODE_ENV !== 'production' });
app.mount('#app');
