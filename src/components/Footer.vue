<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      
      <div class="footer-col brand-col">
        <img src="/images/ZeugUndKramFlach.png" alt="Logo" class="footer-logo" />
        <p class="brand-text">
          Wir machen Digital einfach.<br>
          Websites & Apps für Unternehmen mit Ambitionen.
        </p>
        <a href="https://status.zeugundkram.de" target="_blank" class="status-btn">
          Zur Status Webseite <span class="icon">↗</span>
        </a>
      </div>

      <div class="footer-col">
        <h3>Leistungen</h3>
        <ul>
          <li><a href="#">Entwicklung</a></li>
          <li><a href="#">Hosting und Betrieb</a></li>
          <li><a href="#">Weiterentwicklung</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Über uns</a></li>
          <li><a href="#">Datenschutz</a></li>
          <li><a href="#">Impressum</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Kontakt</h3>
        <ul>
          <li><a href="#">Kontaktformular & Adressen</a></li>
          <li><a href="mailto:hello@zeugundkram.de" class="email-link">📧 hello@zeugundkram.de</a></li>
        </ul>
        <div class="social-icons">
          <a href="#" class="social-icon">In</a>
          <a href="#" class="social-icon">Ig</a>
          <a href="#" class="social-icon">Fb</a>
        </div>
      </div>

    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Zeug & Kram</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #1a1a1a; /* Dark background like the image */
  color: #ffffff;
  padding: 4rem 2rem 1rem 2rem;
  font-family: sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap; /* Allows wrapping on mobile */
  gap: 2rem;
  justify-content: space-between;
}

.footer-col {
  flex: 1;
  min-width: 200px; /* Ensures columns don't get too thin */
}

/* Brand Column */
.brand-col {
  flex: 1.5; /* Give the logo column a bit more space */
}

.footer-logo {
  height: 40px;
  margin-bottom: 1.5rem;
  filter: brightness(0) invert(1); /* Makes a dark logo white if needed */
}

.brand-text {
  line-height: 1.6;
  color: #b3b3b3;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Headers */
h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

/* Links & Lists */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.8rem;
}

a {
  color: #b3b3b3;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

a:hover {
  color: #ffffff;
}

/* Status Button */
.status-btn {
  display: inline-block;
  background-color: #4e5d6c;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.status-btn:hover {
  background-color: #5d6d7e;
}

/* Socials */
.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 32px;
  height: 32px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
}

.footer-bottom {
  text-align: center;
  margin-top: 4rem;
  border-top: 1px solid #333;
  padding-top: 1rem;
  color: #666;
  font-size: 0.8rem;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column; /* Stacks columns on top of each other */
    text-align: left;
  }
  
  .footer-col {
    width: 100%;
  }

  .brand-col {
    margin-bottom: 2rem;
  }
}
</style>