<template>
  <div class="legal-container">
    <h1>Impressum</h1>

    <section>
      <h2>Angaben gemäß § 5 TMG</h2>
      <div class="address-block">
        <p>
          <strong>Viktor Dombrowski</strong><br />
          Lieblstraße 23A<br />
          93059 Regensburg
        </p>
      </div>
    </section>

    <section>
      <h2>Kontakt</h2>
      <p>
        Telefon: [Deine Telefonnummer]<br />
        E-Mail: <a href="mailto:zeugkramdinge@gmail.com">zeugkramdinge@gmail.com</a>
      </p>
    </section>

    <section>
      <h2>Redaktionell verantwortlich</h2>
      <p>
        Viktor Dombrowski<br />
        Lieblstr. 23A<br />
        93059 Regensburg
      </p>
    </section>

    <p class="source">
      Quelle: <a href="https://www.e-recht24.de" target="_blank">e-recht24.de</a>
    </p>
  </div>
</template>

<style scoped>
.legal-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 150px 2rem 8rem; /* Enough space to clear your fixed header */
  line-height: 1.8;
  color: #ccc;
  font-family: var(--font-body, 'Varela Round', sans-serif);
}

section {
  margin-bottom: 4rem;
}

h1 {
  font-family: var(--font-header, 'Exo', sans-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--brand-green, #89BD8B);
  margin-bottom: 3.5rem;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
}

h2 {
  font-family: var(--font-header, 'Exo', sans-serif);
  font-size: 1.4rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

p {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

.address-block {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--brand-green, #89BD8B);
  color: #fff;
}

.address-block p {
  margin-bottom: 0;
}

a {
  color: var(--brand-green, #89BD8B);
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.source {
  font-size: 0.85rem;
  margin-top: 6rem;
  opacity: 0.4;
  border-top: 1px solid #222;
  padding-top: 2rem;
}
</style>