<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="page-intro">
    <h1>{{ title }}</h1>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.page-intro {
  width: 100%;
  margin-bottom: 3rem;
  text-align: center;
}

h1 {
  margin-bottom: 0.5rem;
  font-family: var(--font-header);
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  font-weight: 800;
  color: var(--brand-green);
  text-transform: uppercase;
}

p {
  max-width: 450px;
  margin: 0 auto;
  color: var(--text-dim);
  font-size: 1.1rem;
}
</style>
