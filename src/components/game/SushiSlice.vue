<script setup lang="ts">
// PLATZHALTER-GRAFIK: ein Sushistück von oben — Teigrand, süßer Senf, Brät.
// Wird im Schneide-Schritt und auf dem Abschlussbild verwendet.

defineProps<{
  x: number
  y: number
  r: number
}>()
</script>

<template>
  <g class="slice">
    <circle class="dough" :cx="x" :cy="y" :r="r" />
    <circle class="mustard" :cx="x" :cy="y" :r="r * 0.74" />
    <circle class="meat" :cx="x" :cy="y" :r="r * 0.56" />
  </g>
</template>

<style scoped>
.dough {
  fill: #d8b878;
  stroke: #b8964f;
  stroke-width: 0.6;
}

.mustard {
  fill: #cf9b3b;
}

.meat {
  fill: #d09a90;
  stroke: #b87f75;
  stroke-width: 0.4;
}
</style>
