<script setup lang="ts">
// Der "Done!"-Stempel zwischen zwei Rezeptschritten.
// Die Anzeigedauer steuert die Elternkomponente.
</script>

<template>
  <div class="stamp-layer">
    <div class="stamp">Done!</div>
  </div>
</template>

<style scoped>
.stamp-layer {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
}

.stamp {
  font-family: var(--font-header);
  font-size: clamp(3rem, 14vw, 7rem);
  font-weight: 900;
  font-style: italic;
  letter-spacing: 2px;
  color: var(--brand-green);
  text-shadow: 0 0 30px rgba(137, 189, 139, 0.5);
  transform: rotate(-8deg);
  animation: slam 0.5s cubic-bezier(0.2, 1.6, 0.4, 1);
}

@keyframes slam {
  0% {
    opacity: 0;
    transform: rotate(-8deg) scale(2.6);
  }
  60% {
    opacity: 1;
    transform: rotate(-8deg) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: rotate(-8deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stamp {
    animation: none;
  }
}
</style>
