<script setup lang="ts">
import SiteHeader from './components/Header.vue'
import SiteFooter from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <SiteHeader />

    <main class="landing-page">
      <section class="hero">
        <h1>Willkommen bei <span class="highlight">Zeug & Kram</span></h1>
        <p>Your shop for everything and anything. Built with speed and precision.</p>
        <div class="actions">
          <button class="btn-primary">Entdecken</button>
          <button class="btn-secondary">Mehr erfahren</button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style>
/* Global Styles */
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color-scheme: light;
}

body {
  margin: 0;
  display: flex;
  place-content: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  width: 100%;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Keeps footer at bottom */
}

.landing-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
}

.hero {
  text-align: center;
  max-width: 800px;
}

h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.highlight {
  color: #42b883;
}

p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2.5rem;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

.btn-primary {
  background-color: #42b883;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: #2c3e50;
  border: 2px solid #2c3e50;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>