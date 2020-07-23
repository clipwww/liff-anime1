import { createApp } from 'vue'
import VueMeta from 'vue-meta'


const app = createApp({})

// @ts-ignore
app.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})