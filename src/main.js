import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

import AppLoader from '@/components/AppShell/AppLoader.vue';

import router from './router';
import { nxtVue } from '@nxt/nxt-vue';
import { nxtTracking } from '@nxt/libraries/plugins/nxt-tracking';
import { applyRouteGuards } from '@/lib/route-guards';
import mdiIcons from '@/lib/icon-list';

import 'normalize.css';
import '@/assets/scss/index.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(AppLoader)
  .use(pinia)
  .use(router)
  .use(nxtVue, { mdiIcons })
  .use(nxtTracking)
  .mount('#app')
;

applyRouteGuards(router);
