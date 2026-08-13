<script setup lang="ts">
import { openDoors, DOORS } from '../data/zeugzember'
</script>

<template>
  <main class="page-centered">
    <div class="hero">
      <img src="/images/ZeugUndKramFlach.png" alt="Zeug & Kram" class="logo" />
      <p class="claim">Hier wird noch cooles Zeug hinkommen (und Kram auch).</p>

      <div class="actions">
        <router-link to="/zeugzember" class="btn btn-primary">Zum Zeugzember</router-link>
        <router-link to="/socials" class="btn btn-secondary">Meine Links</router-link>
      </div>

      <p class="counter">{{ openDoors }} von {{ DOORS.length }} Türen sind offen</p>
    </div>
  </main>
</template>

<style scoped>
.hero {
  width: 100%;
  text-align: center;
}

.logo {
  display: block;
  width: 80%;
  max-width: 500px;
  height: auto;
  margin: 0 auto 2rem;
}

.claim {
  margin-bottom: 3rem;
  color: var(--text-muted);
  font-size: 1.2rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.counter {
  margin-top: 3rem;
  font-family: var(--font-header);
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--text-faint);
  text-transform: uppercase;
}
</style>
