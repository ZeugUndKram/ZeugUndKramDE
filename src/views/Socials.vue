<script setup lang="ts">
import PageIntro from '../components/PageIntro.vue'
import SocialCard from '../components/SocialCard.vue'
import { SOCIALS } from '../data/socials'
</script>

<template>
  <main class="page-centered">
    <PageIntro title="Meine Links" subtitle="Nein, OF ist nicht dabei" />

    <div class="link-list">
      <SocialCard v-for="link in SOCIALS" :key="link.key" :link="link" />
    </div>
  </main>
</template>

<style scoped>
.link-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 500px;
}
</style>
