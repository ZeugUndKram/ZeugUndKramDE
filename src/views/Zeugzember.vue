<script setup lang="ts">
import DoorTile from '../components/DoorTile.vue'
import { DOORS } from '../data/zeugzember'
</script>

<template>
  <main class="zeugzember">
    <div class="grid">
      <DoorTile v-for="door in DOORS" :key="door.day" :door="door" />
    </div>
  </main>
</template>

<style scoped>
.zeugzember {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - var(--header-height));
  padding: 1rem 2rem;
  overflow: hidden;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-height: 100%;
}

/* Die Breite deckelt die Hoehe: vier Spalten a 3:2 muessen in drei Reihen
   auf den Bildschirm passen, ohne dass die Seite scrollt. */
@media (min-width: 1000px) {
  .grid {
    max-width: calc((100vh - 150px) / 3 * 1.5 * 4);
  }
}

@media (max-width: 1200px) and (min-width: 851px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: calc((100vh - 150px) / 4 * 1.5 * 3);
  }
}

/* Ab Tablet abwaerts darf die Seite normal scrollen. */
@media (max-width: 850px) {
  .zeugzember {
    height: auto;
    min-height: calc(100vh - var(--header-height));
    align-items: flex-start;
    padding: 2rem 1rem;
    overflow: visible;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
    max-height: none;
  }
}

@media (max-width: 500px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
