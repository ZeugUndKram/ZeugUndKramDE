<script setup lang="ts">
import SiteHeader from './components/Header.vue'
import SiteFooter from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <SiteHeader />

    <main class="landing-page">
      <div class="hero">
        <h1 class="hero-title">
          Willkommen bei <br>
          <img src="/images/ZeugUndKramFlach.png" alt="Zeug & Kram" class="hero-logo" />
        </h1>
        <p>Hier wird noch cooles Zeug hinkommen (und Kram auch).</p>
        <div class="actions">
          <button class="btn-primary">Entdecken</button>
          <button class="btn-secondary">Mehr erfahren</button>
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<style>
/* 1. Import Fonts from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Exo:wght@400;700;900&family=Varela+Round&display=swap');

/* 2. Global Reset & Variables */
:root {
  --brand-green: #89BD8B;
  --font-header: 'Exo', sans-serif;
  --font-body: 'Varela Round', sans-serif;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #121212;
  color: white;
  /* Applying Varela Round as the default body font */
  font-family: var(--font-body);
  overflow-x: hidden;
}

#app {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.landing-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8rem 0;
}

.hero {
  text-align: center;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
}

.hero-title {
  /* Applying Exo for the "Willkommen bei" text */
  font-family: var(--font-header);
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.2;
  margin: 0 0 2rem 0;
  font-weight: 900; /* Extra bold for the tech vibe */
  color: #eee;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-logo {
  display: block;
  margin: 1.5rem auto 0 auto;
  width: 100%;
  max-width: 600px; 
  height: auto;
  /* Updated filter to match your specific green #89BD8B */
}

p {
  font-size: 1.25rem;
  color: #aaa;
  margin-bottom: 3.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  /* This naturally inherits Varela Round from body */
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  /* Using Exo for buttons to give them a "UI/Tech" feel */
  font-family: var(--font-header);
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--brand-green);
  color: #121212; /* Dark text on light green for better contrast */
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid #333;
}

button:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
}
</style>