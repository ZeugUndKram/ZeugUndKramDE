<script setup lang="ts">
// Der Hinweis am oberen Brettrand: was gerade dran ist.
withDefaults(
  defineProps<{
    label: string
    /** Zeile darüber, klein und leise */
    lead?: string
    /** Kurz rot, wenn etwas danebengegangen ist */
    foul?: boolean
  }>(),
  { lead: 'Als Nächstes', foul: false },
)
</script>

<template>
  <p class="hint" :class="{ foul }">
    <span class="lead">{{ lead }}</span>
    <span class="value">{{ label }}</span>
  </p>
</template>

<style scoped>
.hint {
  position: absolute;
  top: 4%;
  left: 50%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.lead {
  font-family: var(--font-header);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-faint);
}

.value {
  font-family: var(--font-header);
  font-size: clamp(1rem, 3.4vw, 1.5rem);
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text);
  transition: color 0.15s ease;
}

.foul .value {
  color: #e0655f;
  animation: shake 0.3s ease;
}

@keyframes shake {
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .foul .value {
    animation: none;
  }
}
</style>
