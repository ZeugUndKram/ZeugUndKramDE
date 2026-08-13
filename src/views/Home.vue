<template>
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
</template>

<style scoped>
.landing-page {
  /* 100vh (viewport height) minus 80px (your header height).
     This ensures the footer starts exactly at the bottom edge of the screen.
  */
  margin-top: -80px;
  min-height: calc(100vh - 0px); 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* Removed the 10rem vertical padding to prevent over-stretching */
  padding: 2rem 0; 
}

.hero {
  text-align: center;
  width: 100%;
  padding: 0 2rem;
}

.hero-title {
  font-family: var(--font-header);
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.4; 
  margin-bottom: 2rem; /* Slightly reduced to keep everything 'above the fold' */
  font-weight: 900;
  color: #eee;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hero-logo {
  display: block;
  margin: 0 auto;
  width: 80%;
  max-width: 500px; 
  height: auto;
  padding: 1.5rem 0; 
}

p {
  font-size: 1.2rem;
  color: #aaa;
  margin-bottom: 3rem; /* Slightly reduced */
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Note: Keeping these styles here as they were in your original file, 
   but ideally 'app-wrapper' and 'main' flex settings should be in App.vue 
*/
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

main {
  flex: 1; 
  display: flex;
  flex-direction: column;
}
</style>