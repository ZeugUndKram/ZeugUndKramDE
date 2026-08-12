<script setup lang="ts">
// PLATZHALTER-GRAFIKEN.
// Alles hier ist gezeichnetes SVG und soll später durch echte Sprites ersetzt
// werden. Zum Tauschen nur den <template>-Teil pro `name` gegen ein <img>
// austauschen — die Aufrufstellen und die Größenlogik bleiben, wie sie sind.

defineProps<{
  name: 'bowl' | 'ingredient'
  /** Füllfarbe der Zutat, wird beim Sprite-Tausch überflüssig */
  color?: string
  /** Wird als Beschriftung unter die Zutat gesetzt */
  label?: string
}>()
</script>

<template>
  <div class="sprite" :data-sprite="name">
    <svg v-if="name === 'bowl'" viewBox="0 0 120 80" aria-hidden="true">
      <ellipse cx="60" cy="26" rx="52" ry="16" fill="#2a2a2a" />
      <path d="M8 26a52 52 0 0 0 104 0Z" fill="#3a3a3a" />
      <path d="M8 26a52 52 0 0 0 104 0Z" fill="none" stroke="#4d4d4d" stroke-width="2" />
      <ellipse cx="60" cy="26" rx="44" ry="12" fill="#1b1b1b" />
    </svg>

    <svg v-else viewBox="0 0 60 60" aria-hidden="true">
      <ellipse cx="30" cy="24" rx="24" ry="9" fill="#333" />
      <ellipse cx="30" cy="23" rx="19" ry="7" :fill="color ?? '#888'" />
      <path d="M6 24a24 24 0 0 0 48 0Z" fill="#3f3f3f" />
      <path d="M6 24a24 24 0 0 0 48 0Z" fill="none" stroke="#555" stroke-width="1.5" />
    </svg>

    <span v-if="label" class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.sprite {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

svg {
  width: 100%;
  height: auto;
}

.label {
  margin-top: 0.2rem;
  font-family: var(--font-header);
  font-size: clamp(0.6rem, 1.4vw, 0.8rem);
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
