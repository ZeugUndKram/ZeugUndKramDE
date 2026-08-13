<script setup lang="ts">
import type { SocialLink } from '../data/socials'

defineProps<{
  link: SocialLink
}>()
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="card social-card"
    :class="link.key"
  >
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path :d="link.icon" />
    </svg>
    <span class="info">
      <span class="label">{{ link.label }}</span>
      <span class="note">{{ link.note }}</span>
    </span>
  </a>
</template>

<style scoped>
.social-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  padding: 1.2rem 2rem;
}

.icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  color: var(--text-faint);
  transition: color 0.2s ease;
}

.info {
  display: flex;
  flex-direction: column;
}

.label {
  font-family: var(--font-header);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
}

.note {
  font-size: 0.85rem;
  color: var(--text-faint);
}

/* Jede Plattform behaelt beim Hover ihre eigene Farbe. */
.youtube:hover .icon {
  color: #ff0000;
}
.tiktok:hover .icon {
  color: #fe2c55;
}
.tindie:hover .icon {
  color: #ffaa00;
}

@media (max-width: 600px) {
  .social-card {
    gap: 1.2rem;
    padding: 1rem 1.5rem;
  }
}
</style>
