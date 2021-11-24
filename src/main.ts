import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import fontAwesome from './plugins/fontAwesome';
import i18n from './plugins/i18n';

import TooltipVue from '@/components/Tooltip.vue';

const app = createApp(App);

app.component('Tooltip', TooltipVue);

app.use(store);
app.use(router);

app.use(fontAwesome);
app.use(i18n);

app.mount('#app');
