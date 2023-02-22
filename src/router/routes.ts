import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        redirect: 'accounts'
      },
      { 
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'accounts',
        component: () => import('pages/AccountsPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
