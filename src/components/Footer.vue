<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Zeug & Kram. Made with Vue + Vite.</p>
      <div class="socials">
        <span>Impressum</span>
        <span>Datenschutz</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 0;
  margin-top: auto; /* Pushes footer to bottom if content is short */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.socials {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>