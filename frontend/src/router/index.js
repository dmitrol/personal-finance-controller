import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'main',
    component: () =>
      import(/* webpackChunkName: "MainWrapper" */ '@/views/AuthWrapper'),
    meta: { requireAuth: true },
  },
  {
    path: '/registration',
    name: 'registration',
    component: () =>
      import(
        /* webpackChunkName: "registration" */ '../views/AppRegistration.vue'
      ),
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/AppLogin.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    try {
      if (!store.state.auth.accessToken) {
        await store.dispatch('auth/refreshToken')
      }
      if (!store.state.profile.profile) {
        await store.dispatch('profile/getProfile')
      }
    } catch (error) {
      next({ name: 'login' })
      return
    }
  }

  next()
})

export default router
