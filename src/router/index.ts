import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

import { loadComponents } from './utils';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      label: 'Anime1 動畫列表'
    }
  },
  {
    path: '/bangumi/:id',
    name: 'Bangumi',
    component: loadComponents('Bangumi'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
