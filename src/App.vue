<script setup lang="ts">
import SiteHeader from './components/Header.vue'
import SiteFooter from './components/Footer.vue'
import { onMounted } from 'vue'
import { supabase } from './supabase' // Ensure your supabase client is imported

onMounted(async () => {
  // Use the function we just created in the SQL editor
  const { error } = await supabase.rpc('increment_views', { 
    target_name: 'total_views' 
  })
  
  if (error) console.error('Error incrementing views:', error)
})
</script>

<template>
  <div class="app-wrapper">
    <SiteHeader />

    <router-view />

    <SiteFooter />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Exo:wght@400;700;900&family=Varela+Round&display=swap');

:root {
  --brand-green: #89BD8B;
  --font-header: 'Exo', sans-serif;
  --font-body: 'Varela Round', sans-serif;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: white;
  font-family: var(--font-body);
  overflow-x: hidden;
}
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  /* Prevent horizontal scrolling */
  overflow-x: hidden; 
}

/* Ensure the router-view (Home/Legal) grows to fill the space */
main {
  flex: 1;
  width: 100%;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
}

/* --- Global Button Styles --- */
button {
  padding: 1rem 2.5rem;
  font-family: var(--font-header);
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--brand-green);
  color: #121212;
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid #333 !important;
}

button:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
}


</style>