import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { createPinia } from 'pinia'

import LandingPage from './pages/LandingPage.vue'
import LoginPage from './pages/LoginPage.vue'
import AppLayout from './components/layout/AppLayout.vue'
import InboxPage from './pages/app/InboxPage.vue'
import BoardPage from './pages/app/BoardPage.vue'
import PlannerPage from './pages/app/PlannerPage.vue'
import ProfilePage from './pages/app/ProfilePage.vue'
import { useAuth } from './stores/useAuth'
import ForgotPasswordPage from './pages/ForgotPasswordPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path:'/forgot-password',
    name:'Forgot Password',
    component:ForgotPasswordPage,
    meta:{ requiresAuth: false }
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'inbox', name: 'Inbox', component: InboxPage },
      { path: 'board', name: 'Board', component: BoardPage },
      { path: 'planner', name: 'Planner', component: PlannerPage },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: '', redirect: 'inbox' }
    ]
  },
  { path: '/:pathMatch(.*)', redirect: '/' }
]

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

router.beforeEach((to,_,next) => {
  const auth = useAuth()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && auth.isLoggedIn) {
    next('/app/inbox')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
