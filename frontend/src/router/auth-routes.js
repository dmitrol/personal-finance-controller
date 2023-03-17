// import store from '@/store'

export const authRoutes = [
  {
    path: '/statistic',
    name: 'statistic',
    component: () =>
      import(/* webpackChunkName: "StatisticsView" */ '@/views/StatisticsView'),
  },
  {
    path: '/records',
    name: 'records',
    component: () =>
      import(/* webpackChunkName: "RecordView" */ '@/views/RecordView'),
  },
  {
    path: '/category',
    name: 'category',
    component: () =>
      import(/* webpackChunkName: "CategoryView" */ '@/views/CategoryView'),
  },
  {
    path: '/bills',
    name: 'bills',
    component: () =>
      import(/* webpackChunkName: "BillView" */ '@/views/BillView'),
  },
  {
    path: '/currency',
    name: 'currency',
    component: () =>
      import(/* webpackChunkName: "CurrencyView" */ '@/views/CurrencyView'),
  },
]

export function markAsAuth(routes) {
  for (const route of routes) {
    route.requireAuth = true
    if (Array.isArray(route.children)) {
      markAsAuth(route.children)
    }
  }
}
