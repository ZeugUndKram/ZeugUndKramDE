<template>
  <div class="zeugzember-container">
    <div class="grid-wrapper">
      <component
        v-for="n in 12"
        :key="n"
        :is="n === 1 ? 'router-link' : 'div'"
        :to="n === 1 ? '/zeugzember/esc' : null"
        class="project-block"
        :class="{ 'is-link': n === 1 }"
      >
        <div class="block-content">
          <span class="day-number">{{ n.toString().padStart(2, '0') }}</span>
          <h3>Projekt {{ n }}</h3>
          <p>{{ n === 1 ? 'ESC Discovery' : 'Coming soon...' }}</p>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped>
.zeugzember-container {
  /* Use 100% or a very high max-width for the 'Full Width' look */
  width: 100%;
  max-width: 100%; 
  margin: 0;
  /* Reduced padding-top so it starts closer to header, 
     increased side padding for a 'gallery' margin */
  padding: 30px 4rem 5rem; 
  min-height: 100vh;
  box-sizing: border-box;
}

/* --- THE RESPONSIVE GRID --- */
.grid-wrapper {
  display: grid;
  gap: 2rem;
  /* 1. START WITH 4 COLUMNS */
  grid-template-columns: repeat(4, 1fr);
}

/* 2. SNAP TO 3 COLUMNS (Large Laptops/Desktops) */
@media (max-width: 1400px) {
  .grid-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
  .zeugzember-container {
    padding: 120px 2rem 5rem; /* Shrink side padding on smaller screens */
  }
}

/* 3. SNAP TO 2 COLUMNS (Tablets) */
@media (max-width: 1000px) {
  .grid-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 4. SNAP TO 1 COLUMN (Mobile) */
@media (max-width: 600px) {
  .grid-wrapper {
    grid-template-columns: 1fr;
  }
  .zeugzember-container {
    padding: 100px 1.5rem 5rem;
  }
}

/* --- BLOCK STYLING --- */
.project-block {
  background: #1a1a1a;
  border: 1px solid #222;
  border-radius: 16px;
  /* Aspect ratio for the rectangular look */
  aspect-ratio: 3 / 2; 
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.project-block:hover {
  border-color: var(--brand-green);
  transform: translateY(-8px) scale(1.02);
  background: #1f1f1f;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.block-content {
  text-align: center;
  padding: 2rem;
}

.day-number {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  font-family: var(--font-header);
  font-size: 1rem; /* Made bigger to match block size */
  color: var(--brand-green);
  font-weight: 900;
  letter-spacing: 2px;
  opacity: 0.8;
}

h3 {
  font-family: var(--font-header);
  text-transform: uppercase;
  font-size: 1.5rem; /* Bigger title */
  margin-bottom: 0.75rem;
  color: #fff;
}

p {
  font-size: 1rem;
  color: #888;
  margin: 0;
  font-family: var(--font-body);
}
</style>