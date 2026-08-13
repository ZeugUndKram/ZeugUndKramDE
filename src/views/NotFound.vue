<script setup lang="ts">
import PageIntro from '../components/PageIntro.vue'
</script>

<template>
  <main class="page-centered">
    <PageIntro title="404" subtitle="Diese Seite gibt es nicht (mehr)." />
    <router-link to="/" class="btn btn-primary">Zurück zur Startseite</router-link>
  </main>
</template>
