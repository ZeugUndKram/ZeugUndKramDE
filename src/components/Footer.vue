<template>
  <footer class="footer">
    <div class="footer-content">
      
      <div class="footer-col brand">
        <img src="/images/ZeugUndKramFlach.png" alt="Logo" class="footer-logo" />
        <p class="brand-text">Wir machen Digital einfach.<br>Websites & Apps für Unternehmen.</p>
        <a href="#" class="status-btn">Zur Status Webseite ↗</a>
      </div>

      <div class="footer-col">
        <h4>Leistungen</h4>
        <ul>
          <li><a href="#">Entwicklung</a></li>
          <li><a href="#">Hosting</a></li>
          <li><a href="#">Betrieb</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#">Portfolio</a></li>
          <li><a href="/privacy">Datenschutz</a></li>
          <li>
  <router-link to="/legal">Impressum</router-link>
</li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Kontakt</h4>
        <p class="email-text">zeugkramdinge@gmail.com</p>
        <div class="socials">
          <span class="soc">In</span>
          <span class="soc">Ig</span>
          <span class="soc">Fb</span>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: #000;
  padding: 5rem 0 2rem 0;
  border-top: 1px solid #111;
  /* Ensure the footer uses Varela Round as base */
  font-family: 'Varela Round', sans-serif;
}

.footer-content {
  width: 90%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-col {
  flex: 1;
  min-width: 200px;
}

.brand {
  flex: 2;
}

.footer-logo {
  height: 35px;
  margin-bottom: 1.5rem;
}

.brand-text {
  color: #aaa;
  line-height: 1.6;
}

.email-text {
  color: #89BD8B; /* Your Brand Green */
  font-family: 'Exo', sans-serif; /* Tech feel for email */
  font-weight: 700;
  margin-bottom: 1rem;
}

h4 {
  font-family: 'Exo', sans-serif; /* Tech feel for headings */
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.8rem;
}

a {
  color: #888;
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent !important; /* Fix for hover boxes */
}

a:hover {
  color: #89BD8B; /* Turn green on hover */
}

.status-btn {
  display: inline-block;
  font-family: 'Exo', sans-serif;
  padding: 0.6rem 1.2rem;
  background: #1a1a1a;
  color: #eee;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.status-btn:hover {
  border-color: #89BD8B;
  color: #89BD8B;
  transform: translateY(-2px);
}

.socials {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.soc {
  width: 35px;
  height: 35px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #666;
  font-family: 'Exo', sans-serif;
  transition: color 0.2s;
}

.soc:hover {
  color: #89BD8B;
}

.copyright {
  text-align: center;
  margin-top: 5rem;
  color: #333;
  font-size: 0.8rem;
  border-top: 1px solid #0a0a0a;
  padding-top: 2rem;
  font-family: 'Exo', sans-serif;
}
</style>