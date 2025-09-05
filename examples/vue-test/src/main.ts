import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createMonitor } from './createMonitor';

const app = createApp(App);
createMonitor(app);

app.mount('#app');
