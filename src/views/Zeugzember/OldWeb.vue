<template>
  <div class="oldweb-page">
    <div class="viewer-container">
      <div class="controls">
        <h1 class="title">Internet-Zeitmaschine</h1>
        <div class="button-group">
          <router-link to="/" class="btn-secondary">← Zurück</router-link>
          <button @click="loadRandomSite" class="btn-primary">
            🎲 Zufällige Seite
          </button>
        </div>
        <p class="status-text">Besuche gerade: <span>{{ currentSite }}</span></p>
      </div>

      <div class="iframe-window">
        <div class="window-bar">
          <div class="dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="address-bar">{{ currentSite }}</div>
        </div>
        <iframe 
          :src="currentSite" 
          frameborder="0" 
          allowfullscreen
          class="web-frame"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// List of iframe-friendly or interesting URLs
const sites = [
  'https://sivasliboy58.de.tl/wo-ich-wohne.htm',
  'https://moslem-saga.de.tl/LUSTIGE-BIDER.htm',
  'http://www.toedliche-romane.de',
  'https://www.angelfire.com/realm2/spacecowboy/index.html',
  'https://blackforest-connemara.de/html/body_clifden_show_04.html'
]

const currentSite = ref(sites[0])

const loadRandomSite = () => {
  // Prevent picking the same site twice in a row
  let newSite = currentSite.value
  while (newSite === currentSite.value) {
    const randomIndex = Math.floor(Math.random() * sites.length)
    newSite = sites[randomIndex]
  }
  currentSite.value = newSite
}

onMounted(() => {
  loadRandomSite()
})
</script>

<style scoped>
.oldweb-page {
  /* Fits perfectly between header and footer */
  min-height: 100vh;
  margin-top: -80px; /* Counteracts the header spacer */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0d0d0d;
  padding: 100px 2rem 4rem 2rem;
  box-sizing: border-box;
}

/* Ensure header spacer is hidden for this specific full-screen layout */
:deep(.header-spacer) {
  display: none;
}

.viewer-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.controls {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-family: var(--font-header);
  font-size: 2rem;
  color: var(--brand-green);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.btn-primary, .btn-secondary {
  font-family: 'Exo', sans-serif;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--brand-green);
  color: #000;
  border: none;
}

.btn-secondary {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.status-text {
  color: #666;
  font-size: 0.9rem;
}

.status-text span {
  color: #aaa;
}

/* Browser Window Styling */
.iframe-window {
  flex-grow: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
}

.window-bar {
  background: #222;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.address-bar {
  background: #111;
  color: #888;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 4px;
  flex-grow: 1;
  text-align: center;
  font-family: monospace;
}

.web-frame {
  width: 100%;
  flex-grow: 1;
  background: white; /* Most sites expect a white background */
}

@media (max-width: 768px) {
  .oldweb-page {
    padding-top: 120px;
  }
  
  .viewer-container {
    height: 70vh;
  }
}
</style>