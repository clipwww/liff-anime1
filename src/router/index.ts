import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'

import { loadComponents } from './utils';

Vue.use(VueRouter)

const routes: RouteConfig[] = [
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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: loadComponents('Admin/Layout'),
    redirect: { name: 'AdminDashboard' },
    meta: {
      auth: true,
      label: '後台'
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: loadComponents('Admin/Dashboard'),
        meta: {
          auth: true,
          label: 'Dashboard'
        }
      },
      {
        path: 'user',
        name: 'AdminUser',
        component: loadComponents('Admin/User'),
        meta: {
          auth: true,
          label: '使用者'
        }
      },
      {
        path: 'bangumi',
        name: 'AdminBangumi',
        component: loadComponents('Admin/Bangumi'),
        meta: {
          auth: true,
          label: '暫存資料'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
