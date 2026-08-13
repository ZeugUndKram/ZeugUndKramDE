<script setup lang="ts">
import type { Door } from '../data/zeugzember'

defineProps<{
  door: Door
}>()
</script>

<template>
  <component
    :is="door.to ? 'router-link' : 'div'"
    :to="door.to"
    class="card door"
    :class="{ 'is-open': door.to }"
  >
    <span class="day">{{ String(door.day).padStart(2, '0') }}</span>
    <span class="body">
      <span class="title">{{ door.title || 'Noch zu' }}</span>
      <span v-if="door.note" class="note">{{ door.note }}</span>
    </span>
  </component>
</template>

<style scoped>
.door {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 2;
  padding: 1rem;
  text-align: center;
}

.day {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-family: var(--font-header);
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--brand-green);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.title {
  font-family: var(--font-header);
  font-size: clamp(1rem, 2.2vh, 1.4rem);
  font-weight: 700;
  color: var(--text);
}

.note {
  font-size: 0.85rem;
  color: var(--text-faint);
}

/* Geschlossene Tueren bleiben sichtbar zurueckgenommen. */
.door:not(.is-open) {
  border-style: dashed;
}

.door:not(.is-open) .day,
.door:not(.is-open) .title {
  color: var(--text-faint);
}
</style>
