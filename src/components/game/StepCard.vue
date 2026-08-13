<script setup lang="ts">
import type { RecipeStep } from '../../game/recipe'

defineProps<{
  step: RecipeStep
  index: number
  total: number
}>()

defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="card-layer">
    <div class="step-card">
      <span class="counter">Schritt {{ index + 1 }} von {{ total }}</span>
      <h2>{{ step.title }}</h2>
      <p class="brief">{{ step.brief }}</p>
      <p class="limit">{{ step.timeLimit }} Sekunden</p>
      <button class="btn-primary" autofocus @click="$emit('start')">Los</button>
    </div>
  </div>
</template>

<style scoped>
.card-layer {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.72);
}

.step-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
  text-align: center;
  animation: pop 0.25s ease-out;
}

.counter {
  font-family: var(--font-header);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-faint);
}

h2 {
  margin: 0.6rem 0 1rem;
  font-family: var(--font-header);
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--brand-green);
}

.brief {
  margin-bottom: 1.2rem;
  color: var(--text-soft);
}

.limit {
  margin-bottom: 2rem;
  font-family: var(--font-header);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-faint);
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

@media (prefers-reduced-motion: reduce) {
  .step-card {
    animation: none;
  }
}
</style>
