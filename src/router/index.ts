import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// @ts-ignore
import Home from '../views/Home.vue'

import { loadComponents } from './utils';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      label: '入口'
    }
  },
  {
    path: '/agefans',
    name: 'Agefans',
    component: loadComponents('Agefans/List'),
    meta: {
      label: 'AGE動漫'
    }
  },
  {
    path: '/agefans/:id',
    name: 'AgefansDetails',
    component: loadComponents('Agefans/Details'),
    meta: {
      label: 'AGE動漫'
    }
  },
  {
    path: '/url-share',
    name: 'UrlShare',
    component: loadComponents('UrlShare', true),
    meta: {
      label: '分享連結'
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
