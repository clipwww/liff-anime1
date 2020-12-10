import { createApp } from "vue";
import '@vant/touch-emulator';

// @ts-ignore
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/router/guards';
import { installLIFF } from '@/plugins/liff'
import '@/plugins/dayjs';

import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';
import '@/assets/css/tailwind.css'
import '@/assets/scss/index.scss';


(async () => {
  await installLIFF();

  createApp(App).use(router).use(store).mount("#app");
})();
