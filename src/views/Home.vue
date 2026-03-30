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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* This padding ensures it doesn't hit the header/footer */
  padding: 10rem 0; 
}

.hero {
  text-align: center;
  width: 100%;
  padding: 0 2rem;
}

/* Inside Home.vue <style scoped> */
.hero-title {
  font-family: var(--font-header);
  font-size: clamp(2rem, 6vw, 3.5rem);
  /* Increase this so the two lines of text have air */
  line-height: 1.4; 
  /* Add more space between the text and the logo */
  margin-bottom: 3rem; 
  font-weight: 900;
  color: #eee;
  text-transform: uppercase;
  letter-spacing: 2px;
}
/* Inside Home.vue <style scoped> */
.hero-logo {
  display: block;
  margin: 0 auto;
  /* Reduce the max-width so it doesn't feel scrunched against the text */
  width: 80%;
  max-width: 500px; 
  height: auto;
  /* Add significant space around the logo image */
  padding: 2rem 0; 
}

p {
  font-size: 1.2rem;
  color: #aaa;
  margin-bottom: 4rem;
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Inside App.vue <style> */
.app-wrapper {
  display: flex;
  flex-direction: column;
  /* Forces the wrapper to be at least the full height of the screen */
  min-height: 100vh; 
}

/* This pushes the footer to the very bottom */
main {
  flex: 1; 
  display: flex;
  flex-direction: column;
}
</style>