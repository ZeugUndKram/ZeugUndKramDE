<script setup lang="ts">
import { SOCIALS } from '../data/socials'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
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
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  padding: 6rem 0 4rem;
  border-top: 1px solid var(--line-faint);
  background-color: var(--bg-deep);
  font-family: var(--font-body);
}

.footer-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4rem;
  width: 90%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.brand {
  flex: 1.5;
  max-width: 400px;
}

.col {
  min-width: 150px;
}

.footer-logo {
  height: 55px;
  width: auto;
}

h4 {
  margin-bottom: 2rem;
  font-family: var(--font-header);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

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
}

@media (max-width: 900px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    text-align: center;
  }

  .brand {
    max-width: 100%;
  }

  .socials {
    justify-content: center;
  }
}
</style>
