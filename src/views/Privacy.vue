<template>
  <div class="legal-container">
    <h1>Datenschutzerklärung</h1>

    <section>
      <h2>1. Datenschutz auf einen Blick</h2>
      <h3>Allgemeine Hinweise</h3>
      <p>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
      </p>

      <h3>Datenerfassung auf dieser Website</h3>
      <h4>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
      <p>
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ entnehmen.
      </p>

      <h4>Wie erfassen wir Ihre Daten?</h4>
      <p>
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. per E-Mail). Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst (vor allem technische Daten wie Internetbrowser oder Uhrzeit).
      </p>

      <h4>Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
      <p>
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
      </p>
    </section>

    <section>
      <h2>2. Hosting</h2>
      <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
      <h3>IONOS</h3>
      <p>
        Anbieter ist die IONOS SE, Elgendorfer Str. 57, 56410 Montabaur. Wenn Sie unsere Website besuchen, erfasst IONOS verschiedene Logfiles inklusive Ihrer IP-Adressen. Details entnehmen Sie der Datenschutzerklärung von IONOS: 
        <a href="https://www.ionos.de/terms-gtc/terms-privacy" target="_blank" rel="noopener noreferrer">https://www.ionos.de/terms-gtc/terms-privacy</a>.
      </p>
    </section>

    <section>
      <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
      <h3>Hinweis zur verantwortlichen Stelle</h3>
      <p class="address-block">
        <strong>Viktor Dombrowski</strong><br />
        Lieblstr. 23A<br />
        93059 Regensburg<br /><br />
        E-Mail: zeugkramdinge@gmail.com
      </p>

      <h3>SSL- bzw. TLS-Verschlüsselung</h3>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.
      </p>
    </section>

    <section>
      <h2>4. Datenerfassung</h2>
      <h3>Anfrage per E-Mail oder Telefon</h3>
      <p>
        Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet.
      </p>
    </section>

    <p class="source">Quelle: <a href="https://www.e-recht24.de" target="_blank">e-recht24.de</a></p>
  </div>
</template>

<style scoped>
.legal-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 50px 2rem 8rem; /* Space for the header */
  line-height: 1.8;
  color: #ccc;
  font-family: var(--font-body, 'Varela Round', sans-serif);
}

section {
  margin-bottom: 4rem;
}

h1 {
  font-family: var(--font-header, 'Exo', sans-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--brand-green, #89BD8B);
  margin-bottom: 3rem;
  text-transform: uppercase;
  font-weight: 900;
}

h2 {
  font-family: var(--font-header, 'Exo', sans-serif);
  font-size: 1.5rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

h3, h4 {
  font-family: var(--font-header, 'Exo', sans-serif);
  color: #eee;
  margin-top: 2rem;
}

p {
  margin-bottom: 1.2rem;
}

.address-block {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--brand-green);
  color: #fff;
}

a {
  color: var(--brand-green);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.source {
  font-size: 0.8rem;
  margin-top: 5rem;
  opacity: 0.5;
}

ul {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>