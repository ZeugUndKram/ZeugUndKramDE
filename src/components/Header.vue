<script setup lang="ts">
// Logic for navigation or user state goes here
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">Zeug & Kram</div>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #42b883; /* Vue Green */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav a {
  margin-left: 2rem;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: #42b883;
}
</style>