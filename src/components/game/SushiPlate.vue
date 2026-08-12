<script setup lang="ts">
import { computed } from 'vue'
import SushiSlice from './SushiSlice.vue'

// Das fertige Gericht als Bild: Teller mit den Stücken im Kreis. Zeigt genau
// so viele Stücke, wie im letzten Schritt auch auf dem Teller gelandet sind.

const props = withDefaults(
  defineProps<{
    /** Wie viele Stücke daliegen */
    pieces: number
    /** Wie viele Plätze der Kreis hat */
    total?: number
  }>(),
  { total: 6 },
)

const CENTER = 50
const RING = 26
const SLICE_R = 12

const slots = computed(() =>
  Array.from({ length: props.total }, (_, i) => {
    const angle = (i / props.total) * Math.PI * 2 - Math.PI / 2
    return {
      x: CENTER + Math.cos(angle) * RING,
      y: CENTER + Math.sin(angle) * RING,
    }
  }).slice(0, Math.max(0, Math.min(props.total, props.pieces))),
)
</script>

<template>
  <svg class="plate" viewBox="0 0 100 100" role="img" aria-label="Teller mit Leberkässushi">
    <circle class="dish" :cx="CENTER" :cy="CENTER" r="44" />
    <circle class="rim" :cx="CENTER" :cy="CENTER" r="36" />
    <SushiSlice v-for="(slot, i) in slots" :key="i" :x="slot.x" :y="slot.y" :r="SLICE_R" />
  </svg>
</template>

<style scoped>
.plate {
  display: block;
  width: 100%;
  height: auto;
}

.dish {
  fill: #f2efe8;
  stroke: #cfcabd;
  stroke-width: 1.2;
}

.rim {
  fill: #e7e2d7;
  stroke: #d5cfc2;
  stroke-width: 0.8;
}
</style>
