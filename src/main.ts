import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import fontAwesome from './plugins/fontAwesome';

const app = createApp(App);

app.use(store);
app.use(router);

app.use(fontAwesome);

app.mount('#app');
