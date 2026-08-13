<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/zeugzember', label: 'Zeugzember' },
  { to: '/socials', label: 'Socials' },
]

const route = useRoute()
const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}

// Beim Seitenwechsel schliesst sich das Mobil-Menue von selbst.
watch(() => route.fullPath, closeMenu)

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

// Wer bei offenem Menue aufs Querformat dreht, saehe sonst ein schwarzes Overlay
// ohne Schliessen-Knopf, weil der Burger ab 850px verschwindet.
const handleResize = () => {
  if (window.innerWidth > 850) closeMenu()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo-link">
        <img src="/images/ZeugUndKramFlach.png" alt="Zeug & Kram" class="nav-logo" />
      </router-link>

      <nav class="desktop-nav">
        <router-link v-for="item in NAV" :key="item.to" :to="item.to">
          {{ item.label }}
        </router-link>
      </nav>

      <button
        class="burger-btn"
        :class="{ 'is-active': isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-label="Menü"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="burger-box">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </span>
      </button>
    </div>

    <transition name="fade">
      <nav v-if="isMenuOpen" class="mobile-nav">
        <router-link v-for="item in NAV" :key="item.to" :to="item.to" @click="closeMenu">
          {{ item.label }}
        </router-link>
      </nav>
    </transition>
  </header>
  <div class="header-spacer"></div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  width: 100%;
  padding: 1.2rem 0;
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(15px);
}

.header-spacer {
  height: var(--header-height);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.logo-link {
  display: flex;
}

.nav-logo {
  height: 36px;
  width: auto;
}

.desktop-nav {
  display: flex;
  gap: 2.5rem;
}

.desktop-nav a {
  font-family: var(--font-header);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--text);
  transition: color 0.2s ease;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-exact-active {
  color: var(--brand-green);
}

/* --- Burger --- */
.burger-btn {
  display: none;
  padding: 10px;
  margin: -10px;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 4000;
}

.burger-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
}

.line {
  width: 100%;
  height: 2px;
  background-color: var(--brand-green);
  transform-origin: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.burger-btn.is-active .line:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.burger-btn.is-active .line:nth-child(2) {
  opacity: 0;
}
.burger-btn.is-active .line:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* --- Mobil --- */
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 3500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  background-color: var(--bg-deep);
}

.mobile-nav a {
  font-family: var(--font-header);
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--text);
  transition: color 0.2s ease;
}

.mobile-nav a:hover,
.mobile-nav a.router-link-exact-active {
  color: var(--brand-green);
}

@media (max-width: 850px) {
  .desktop-nav {
    display: none;
  }
  .burger-btn {
    display: block;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
