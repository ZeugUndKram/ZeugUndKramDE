<template>
  <div class="zeugzember-container">
    <div class="grid-wrapper">
      <component
        v-for="n in 12"
        :key="n"
        :is="[1, 2].includes(n) ? 'router-link' : 'div'"
        :to="n === 1 ? '/zeugzember/esc' : n === 2 ? '/zeugzember/jamba' : null"
        class="project-block"
        :class="{ 'is-link': [1, 2].includes(n) }"
      >
        <div class="block-content">
          <span class="day-number">{{ n.toString().padStart(2, '0') }}</span>
          <h3>Projekt {{ n }}</h3>
          <p>
            {{ n === 1 ? 'ESC Discovery' : n === 2 ? 'Jamba Sparabo' : 'Coming soon...' }}
          </p>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped>
.zeugzember-container {
  width: 100%;
  /* Fixed height to keep footer just out of reach */
  height: calc(100vh - 80px); 
  display: flex;
  align-items: center;
  justify-content: center;
  /* Reduced horizontal padding to use more side space */
  padding: 1rem 2rem; 
  box-sizing: border-box;
  overflow: hidden;
}

.grid-wrapper {
  display: grid;
  gap: 1.5rem;
  width: 100%;
  /* The Secret Sauce: 
     The grid can be as wide as the container, 
     BUT it cannot be taller than the available space. 
  */
  max-height: 100%; 
  justify-content: center;
  
  /* Desktop: 4 Columns */
  grid-template-columns: repeat(4, 1fr);
  /* Ensures rows don't grow vertically past their content/aspect-ratio */
  grid-auto-rows: auto; 
}

.project-block {
  background: #1a1a1a;
  border: 1px solid #222;
  border-radius: 16px;
  /* Strict 3:2 Ratio */
  aspect-ratio: 3 / 2; 
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

/* --- RESPONSIVE / SCALING LOGIC --- */

/* For wide screens, we need to limit the width so 3 rows actually fit vertically */
@media (min-width: 1000px) {
  .grid-wrapper {
    /* Calculation: (Available Height / 3 rows) * 1.5 ratio * 4 columns 
       This roughly caps the width so the height fits perfectly.
    */
    max-width: calc((100vh - 150px) / 3 * 1.5 * 4);
  }
}

/* 3 Columns x 4 Rows */
@media (max-width: 1200px) and (min-width: 851px) {
  .grid-wrapper {
    grid-template-columns: repeat(3, 1fr);
    max-width: calc((100vh - 150px) / 4 * 1.5 * 3);
  }
}

/* Tablet & Mobile: Switch to natural scrolling */
@media (max-width: 850px) {
  .zeugzember-container {
    height: auto;
    min-height: calc(100vh - 80px);
    align-items: flex-start;
    padding: 2rem 1rem;
  }
  
  .grid-wrapper {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
    max-height: none;
  }
}

@media (max-width: 500px) {
  .grid-wrapper {
    grid-template-columns: 1fr;
  }
}

/* --- CONTENT STYLING --- */
.project-block:hover {
  border-color: var(--brand-green);
  transform: scale(1.02);
  z-index: 10;
}

.block-content h3 {
  font-family: var(--font-header);
  font-size: clamp(1rem, 2.2vh, 1.5rem);
  color: #fff;
  margin: 0;
}

.day-number {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: var(--brand-green);
  font-weight: 900;
  font-size: 0.8rem;
}
</style>