import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'// Or wherever your main landing content is moved to

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/socials',
    name: 'socials',
    component: () => import('../views/Socials.vue')
  },
  {
    path: '/zeugzember',
    name: 'zeugzember',
    component: () => import('../views/Zeugzember.vue')
  },
  {
    path: '/zeugzember/ESC',
    name: 'esc',
    component: () => import('../views/Zeugzember/ESC.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/Privacy.vue')
  },
  {
    path: '/legal',
    name: 'legal',
    // Lazy load the legal page
    component: () => import('../views/Legal.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Ensure the page scrolls to top when navigating
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router