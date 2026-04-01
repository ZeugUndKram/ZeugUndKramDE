<script setup lang="ts">
import { ref } from 'vue'

// Independent slider positions for each project
const balatroPos = ref(50)
const marioPos = ref(50)
const gdPos = ref(50)
const trPos = ref(50)
</script>

<template>
  <div class="snap-container">
    <section class="snap-section hero-section">
      <div class="content-wrapper">
        <h1 class="title-main">Demakes</h1>
        <p class="subtitle">die ich cool finde</p>
        <div class="scroll-indicator">↓ Scrollen</div>
      </div>
    </section>

    <section class="snap-section comparison-page">
      <div class="comparison-container">
        <div class="video-wrapper modern">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/BalatroPC.mp4" type="video/mp4" />
          </video>
          <div class="label label-right">Original (PC)</div>
        </div>

        <div class="video-wrapper demake" :style="{ width: balatroPos + '%' }">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/BalatroGBA.mp4" type="video/mp4" />
          </video>
          <div class="label label-left">Demake (GBA)</div>
        </div>

        <input type="range" min="0" max="100" v-model="balatroPos" class="comparison-slider" />
        
        <div class="slider-line" :style="{ left: balatroPos + '%' }">
          <div class="slider-button"><span>〈 〉</span></div>
        </div>

        <div class="overlay-info">
          <span class="category-tag">Balatro</span>
          <h2>GBA Port</h2>
          <p>UwU_0664's technisches Wunderwerk</p>
        </div>
      </div>
    </section>

    <section class="snap-section comparison-page">
      <div class="comparison-container">
        <div class="video-wrapper modern">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/SM64.mp4" type="video/mp4" />
          </video>
          <div class="label label-right">Original (N64)</div>
        </div>

        <div class="video-wrapper demake" :style="{ width: marioPos + '%' }">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/SMGBA.mp4" type="video/mp4" />
          </video>
          <div class="label label-left">Demake (GBA)</div>
        </div>

        <input type="range" min="0" max="100" v-model="marioPos" class="comparison-slider" />
        
        <div class="slider-line" :style="{ left: marioPos + '%' }">
          <div class="slider-button"><span>〈 〉</span></div>
        </div>

        <div class="overlay-info">
          <span class="category-tag">Super Mario 64</span>
          <h2>Agamenon's GBA Version</h2>
          <p>Ein beeindruckender Blick darauf, wie Mario 64 auf einem Handheld ausgesehen hätte.</p>
        </div>
      </div>
    </section>

    <section class="snap-section comparison-page">
      <div class="comparison-container">
        <div class="video-wrapper modern">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/GeometryDashPC.mp4" type="video/mp4" />
          </video>
          <div class="label label-right">Original (PC)</div>
        </div>

        <div class="video-wrapper demake" :style="{ width: gdPos + '%' }">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/GeometryDashGBA.mp4" type="video/mp4" />
          </video>
          <div class="label label-left">Demake (GBA)</div>
        </div>

        <input type="range" min="0" max="100" v-model="gdPos" class="comparison-slider" />
        
        <div class="slider-line" :style="{ left: gdPos + '%' }">
          <div class="slider-button"><span>〈 〉</span></div>
        </div>

        <div class="overlay-info">
          <span class="category-tag">Geometry Dash</span>
          <h2>GBA Version</h2>
          <p>Rhythm-Action auf 32-Bit Hardware.</p>
        </div>
      </div>
    </section>

    <section class="snap-section comparison-page">
      <div class="comparison-container">
        <div class="video-wrapper modern">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/TombRaiderPS1.mp4" type="video/mp4" />
          </video>
          <div class="label label-right">Original (PS1)</div>
        </div>

        <div class="video-wrapper demake" :style="{ width: trPos + '%' }">
          <video autoplay muted loop playsinline class="full-video">
            <source src="/demakevids/TombRaiderGBA.mp4" type="video/mp4" />
          </video>
          <div class="label label-left">Demake (GBA)</div>
        </div>

        <input type="range" min="0" max="100" v-model="trPos" class="comparison-slider" />
        
        <div class="slider-line" :style="{ left: trPos + '%' }">
          <div class="slider-button"><span>〈 〉</span></div>
        </div>

        <div class="overlay-info">
          <span class="category-tag">Tomb Raider</span>
          <h2>OpenLara GBA</h2>
          <p>XProger's unglaubliche Engine, die echtes 3D auf den GBA bringt.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.snap-container {
  height: calc(100vh - 80px);
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  background-color: #000;
}

.snap-section {
  height: calc(100vh - 80px);
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  background: radial-gradient(circle at center, #111 0%, #000 100%);
}

.title-main {
  font-family: var(--font-header);
  font-size: clamp(3rem, 10vw, 6rem);
  color: var(--brand-green, #89BD8B);
  text-transform: uppercase;
  text-align: center;
}

.subtitle {
  font-size: 1.2rem;
  color: #888;
  letter-spacing: 5px;
  text-transform: uppercase;
  text-align: center;
  margin-top: 1rem;
}

.comparison-container {
  position: relative;
  width: 100vw;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
}

.modern {
  width: 100vw;
  z-index: 1;
}

.demake {
  z-index: 2;
  border-right: 2px solid var(--brand-green, #89BD8B);
}

.full-video {
  width: 100vw;
  height: 100%;
  object-fit: contain;
}

.comparison-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  appearance: none;
  z-index: 10;
  cursor: ew-resize;
  margin: 0;
}

.comparison-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 100vh;
}

.slider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--brand-green, #89BD8B);
  z-index: 5;
  pointer-events: none;
}

.slider-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: var(--brand-green, #89BD8B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.overlay-info {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 15;
  pointer-events: none;
}

.overlay-info h2 {
  font-family: var(--font-header);
  font-size: 2.2rem;
  color: #fff;
  margin: 0.2rem 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.9);
}

.category-tag {
  color: var(--brand-green, #89BD8B);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.label {
  position: absolute;
  top: 2rem;
  padding: 0.4rem 0.8rem;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.7rem;
  text-transform: uppercase;
  z-index: 5;
}

.label-left { left: 2rem; border-left: 3px solid var(--brand-green, #89BD8B); }
.label-right { right: 2rem; }

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  font-size: 0.8rem;
}

:deep(.header-spacer) {
  display: block !important;
}
</style>