<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 850 && isMenuOpen.value) {
    closeMenu()
  }
}

watch(isMenuOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

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
      <div class="logo-area">
      <div class="logo-area">
        <router-link to="/">
          <img src="/images/ZeugUndKramFlach.png" alt="Logo" class="nav-logo" />
        </router-link>
      </div>      
    </div>

      <nav class="desktop-nav">
        <a href="/">Home</a>
        <a href="#leistungen">Creations</a>
        <a href="/zeugzember">Zeugzember</a>
        <a href="/socials">Socials</a>
      </nav>

      <button 
        class="burger-btn" 
        @click="toggleMenu" 
        :class="{ 'is-active': isMenuOpen }"
        aria-label="Menu"
      >
        <div class="burger-box">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </button>
    </div>

    <transition name="fade">
      <nav v-if="isMenuOpen" class="mobile-nav">
        <div class="mobile-nav-links">
          <a href="/" @click="closeMenu">Home</a>
          <a href="#leistungen" @click="closeMenu">Creations</a>
          <a href="/zeugzember" @click="closeMenu">Zeugzember</a>
          <a href="/socials" @click="closeMenu">Socials</a>
        </div>
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
  width: 100%;
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(15px);
  padding: 1.2rem 0;
  z-index: 3000;
}

.header-spacer {
  height: 80px;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-logo {
  height: 36px;
  width: auto;
}

.nav-logo:hover {
  transform: scale(1.1);
}


.desktop-nav {
  display: flex;
  gap: 2.5rem;
}

.desktop-nav a {
  /* Using Exo for the "Tech" vibe in nav */
  font-family: 'Exo', sans-serif;
  text-decoration: none;
  color: #ffffff; /* Default to white as requested */
  font-weight: 700;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  /* Explicitly removing any background/box effects */
  background: none !important;
  padding: 0;
  border: none;
}

.desktop-nav a:hover {
  color: #89BD8B; /* Text turns green */
  transform: scale(1.1);
  background: transparent !important; /* Forces the box to disappear */
}

/* --- BURGER BUTTON --- */
.burger-btn {
  display: none;
  background: none !important;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin: -10px;
  z-index: 4000;
  transform: none !important; 
  filter: none !important;
  transition: transform 0.4s ease !important;
}

.burger-btn:hover {
  transform: scale(1.1) !important;
}

.burger-box {
  width: 28px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.line {
  width: 100%;
  height: 2px;
  background-color: #89BD8B;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.burger-btn.is-active .line:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.burger-btn.is-active .line:nth-child(2) { opacity: 0; }
.burger-btn.is-active .line:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* --- MOBILE NAV --- */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 3500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.mobile-nav-links a {
  font-family: 'Exo', sans-serif;
  font-size: 2rem;
  color: white;
  text-decoration: none;
  font-weight: 800;
  text-transform: uppercase;
  transition: color 0.2s;
  background: none !important;
}

.mobile-nav-links a:hover {
  color: #89BD8B;
}

@media (max-width: 850px) {
  .desktop-nav { display: none; }
  .burger-btn { display: block; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>