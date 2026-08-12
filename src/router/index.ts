import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/zeugzember/esc',
    name: 'esc',
    component: () => import('../views/Zeugzember/ESC.vue')
  },
  {
    path: '/zeugzember/jamba',
    name: 'jamba',
    component: () => import('../views/Zeugzember/Jamba.vue')
  },
  {
    path: '/zeugzember/oldweb',
    name: 'oldweb',
    component: () => import('../views/Zeugzember/OldWeb.vue')
  },
  {
    path: '/zeugzember/demakes',
    name: 'demakes',
    component: () => import('../views/Zeugzember/Demakes.vue')
  },
  {
    // Alias ohne Umlaut, damit die Adresse auch tippbar und teilbar bleibt.
    path: '/leberkäsesushi',
    alias: '/leberkaesesushi',
    name: 'leberkaesesushi',
    component: () => import('../views/Zeugzember/LeberkaeseSushi.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/Privacy.vue')
  },
  {
    path: '/legal',
    name: 'legal',
    component: () => import('../views/Legal.vue')
  },
  {
    // Faengt geloeschte URLs (z. B. das alte /guestbook) und Tippfehler ab.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router