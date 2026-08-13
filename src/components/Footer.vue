<<<<<<< Updated upstream
<script setup lang="ts">
import { SOCIALS } from '../data/socials'
</script>
=======
>>>>>>> Stashed changes

<template>
  <footer class="footer">
    <div class="footer-content">
<<<<<<< Updated upstream
      <div class="brand">
        <img src="/images/ZeugUndKramFlach.png" alt="Zeug & Kram" class="footer-logo" />
      </div>

      <div class="col">
        <h4>Seiten</h4>
        <ul>
          <li><router-link to="/zeugzember">Zeugzember</router-link></li>
          <li><router-link to="/socials">Socials</router-link></li>
          <li><router-link to="/privacy">Datenschutz</router-link></li>
          <li><router-link to="/legal">Impressum</router-link></li>
        </ul>
      </div>

      <div class="col">
        <h4>Kontakt</h4>
        <p class="email">
          <a href="mailto:zeugkramdinge@gmail.com">zeugkramdinge@gmail.com</a>
        </p>
        <div class="socials">
          <a
            v-for="link in SOCIALS"
            :key="link.key"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="soc"
            :aria-label="link.label"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="link.icon" />
            </svg>
          </a>
        </div>
      </div>
=======
      
      <div class="footer-col brand">
        <img src="../assets/dpsg-lilie_weiß.png" alt="DPSG Lilie" class="footer-logo" />
        <p class="brand-description">
          Deutsche Pfadfinderschaft Sankt Georg<br>
          Stamm Thomas Morus Weiden
        </p>
      </div>

      <div class="links-group">
        <div class="footer-col">
          <h4>Der Stamm</h4>
          <ul>
            <li><a href="/vorstand" class="footer-link">Vorstand</a></li>
            <li><a href="/geschichte" class="footer-link">Geschichte</a></li>
            <li><a href="/heute" class="footer-link">Heute</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Infos</h4>
          <ul>
            <li><a href="/die-gruppen" class="footer-link">Die Gruppen</a></li>
            <li><a href="/termine" class="footer-link">Termine</a></li>
            <li><a href="/blockhuette" class="footer-link">Pfadfinderblockhütte</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Rechtliches</h4>
          <ul>
            <li><router-link to="/impressum" class="footer-link">Impressum</router-link></li>
            <li><router-link to="/datenschutz" class="footer-link">Datenschutz</router-link></li>
            <li><a href="/kontakt" class="footer-link">Kontakt</a></li>
          </ul>
        </div>
      </div>

    </div>
    
    <div class="copyright">
      &copy; 2026 DPSG Weiden
>>>>>>> Stashed changes
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
<<<<<<< Updated upstream
  padding: 6rem 0 4rem;
  border-top: 1px solid var(--line-faint);
  background-color: var(--bg-deep);
  font-family: var(--font-body);
}

.footer-content {
=======
  background-color: #003056; /* Matches your header Navy Blue */
  padding: 4rem 0 0 0;
  color: #ffffff;
  font-family: 'Calibri', sans-serif;
}

.footer-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
>>>>>>> Stashed changes
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4rem;
  width: 90%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.brand {
  flex: 1.2;
}

.col {
  min-width: 150px;
}

.footer-logo {
  height: 60px;
  width: auto;
<<<<<<< Updated upstream
}

h4 {
  margin-bottom: 2rem;
  font-family: var(--font-header);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text);
=======
  margin-bottom: 1.5rem;
  filter: brightness(0) invert(1); /* Ensures logo is white if it wasn't already */
}

.brand-description {
  font-family: 'Arvo', serif;
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.9;
}

h4 {
  font-family: 'Arvo', serif;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 0.9rem;
>>>>>>> Stashed changes
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.8rem;
}

<<<<<<< Updated upstream
li a {
  color: var(--text-dim);
  text-decoration: none;
  transition: color 0.2s ease;
}

li a:hover {
  color: var(--brand-green);
}

.email {
  margin-bottom: 1.5rem;
}

.email a {
  font-family: var(--font-header);
  font-weight: 700;
  color: var(--brand-green);
  text-decoration: none;
}

.email a:hover {
  text-decoration: underline;
}

.socials {
  display: flex;
  gap: 12px;
}

.soc {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--line-faint);
  color: var(--text-faint);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.soc svg {
  width: 18px;
  height: 18px;
}

.soc:hover {
  color: var(--brand-green);
  border-color: var(--line-strong);
=======
.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.footer-link:hover {
  color: #ffffff !important;
  padding-left: 5px !important; /* Subtle shift effect on hover */
}

.copyright {
  text-align: center;
  margin-top: 4rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Arvo', serif;
>>>>>>> Stashed changes
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
  .footer-content {
    flex-direction: column;
<<<<<<< Updated upstream
    align-items: center;
    gap: 3rem;
=======
>>>>>>> Stashed changes
    text-align: center;
    gap: 3rem;
  }
<<<<<<< Updated upstream

  .brand {
    max-width: 100%;
=======
  
  .links-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2.5rem;
  }
  
  .brand {
    margin: 0 auto;
  }
  
  .footer-logo {
    margin: 0 auto 1.5rem;
>>>>>>> Stashed changes
  }

  .footer-link:hover {
    padding-left: 0 !important;
  }
}
</style>
