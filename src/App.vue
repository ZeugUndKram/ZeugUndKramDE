<script setup lang="ts">
import SiteHeader from './components/Header.vue'
import SiteFooter from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <SiteHeader />
    <router-view />
    <SiteFooter />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Der Inhalt schiebt den Footer nach unten, egal wie kurz die Seite ist. */
.app-wrapper :deep(main) {
  flex: 1;
  width: 100%;
}
</style>
