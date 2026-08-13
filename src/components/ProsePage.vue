<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <main class="prose">
    <h1>{{ title }}</h1>
    <slot />
    <p class="source">
      Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer">e-recht24.de</a>
    </p>
  </main>
</template>

<style scoped>
.prose {
  max-width: var(--prose-width);
  margin: 0 auto;
  padding: 3rem 2rem 8rem;
  color: var(--text-soft);
  font-family: var(--font-body);
  line-height: 1.8;
}

h1 {
  margin-bottom: 3rem;
  font-family: var(--font-header);
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 900;
  color: var(--brand-green);
  text-transform: uppercase;
}

.source {
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--line);
  font-size: 0.85rem;
  opacity: 0.4;
}

/* Der Fliesstext kommt per Slot herein, deshalb :deep() statt scoped-Selektoren. */
.prose :deep(section) {
  margin-bottom: 4rem;
}

.prose :deep(h2) {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line-strong);
  font-family: var(--font-header);
  font-size: 1.4rem;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.prose :deep(h3),
.prose :deep(h4) {
  margin-top: 2rem;
  font-family: var(--font-header);
  color: #eee;
}

.prose :deep(p) {
  margin-bottom: 1.2rem;
}

.prose :deep(a) {
  color: var(--brand-green);
  text-decoration: none;
}

.prose :deep(a:hover) {
  text-decoration: underline;
}

.prose :deep(.address-block) {
  padding: 1.5rem;
  border-left: 4px solid var(--brand-green);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
}

.prose :deep(.address-block p) {
  margin-bottom: 0;
}
</style>
