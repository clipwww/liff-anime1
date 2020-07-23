import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/router/guards';
import { installLIFF } from '@/plugins/liff'

import '@/assets/css/tailwind.css'
import '@/assets/scss/index.scss';

(async () => {
  await installLIFF();

  createApp(App).use(router).use(store).mount("#app");
})();