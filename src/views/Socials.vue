<template>
  <div class="socials-container">
    <div class="header">
      <h1>Meine Links</h1>
      <p>Nein, OF ist nicht dabei</p>
    </div>

    <div class="socials-grid">
      <a href="https://youtube.com/@yourchannel" target="_blank" class="social-card youtube">
        <div class="icon-box">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </div>
        <div class="info">
          <h2>YouTube</h2>
          <p>Project Showcases & Tutorials</p>
        </div>
        <div class="arrow">→</div>
      </a>

      <a href="https://tiktok.com/@yourhandle" target="_blank" class="social-card tiktok">
        <div class="icon-box">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.43-.2-3.41.49-.9.63-1.37 1.75-1.27 2.85.01.92.5 1.82 1.25 2.36.93.7 2.19.79 3.25.46 1.05-.33 1.93-1.21 2.21-2.29.18-.58.21-1.18.21-1.78-.03-3.66-.01-7.32-.03-10.98z"/></svg>
        </div>
        <div class="info">
          <h2>TikTok</h2>
          <p>Quick Tips & Behind the Scenes</p>
        </div>
        <div class="arrow">→</div>
      </a>

      <a href="https://tindie.com/stores/yourstore" target="_blank" class="social-card tindie">
        <div class="icon-box">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45zM11 15h2v2h-2v-2zm0-7h2v5h-2V8z"/></svg>
        </div>
        <div class="info">
          <h2>Tindie</h2>
          <p>Hardware Store & PCB Designs</p>
        </div>
        <div class="arrow">→</div>
      </a>

      
    </div>
  </div>
</template>

<style scoped>
.socials-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  /* Change min-height to full screen */
  min-height: 100vh; 
  
  /* Pull the container up by the height of the header 
     to counteract the spacer in Header.vue */
  margin-top: -80px; 

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Ensure the header spacer doesn't create extra white space */
:deep(.header-spacer) {
  display: none;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  width: 100%;
}

h1 {
  font-family: var(--font-header);
  font-size: clamp(2.5rem, 10vw, 3.5rem);
  font-weight: 800;
  color: var(--brand-green);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.header p {
  color: #888;
  font-size: 1.1rem;
  max-width: 450px;
  margin: 0 auto;
}

.socials-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 500px; /* Limits width so it looks like a clean list */
}

.social-card {
  display: flex;
  align-items: center;
  padding: 1.2rem 2rem;
  background: #1a1a1a;
  border: 1px solid #222;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.social-card:hover {
  transform: scale(1.02); /* Slight pop instead of slide */
  border-color: var(--brand-green);
  background: #1f1f1f;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.icon-box {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.icon-box svg {
  width: 100%;
  height: 100%;
}

.info h2 {
  font-family: 'Exo', sans-serif;
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.info p {
  color: #666;
  margin: 0;
  font-size: 0.85rem;
}

.arrow {
  margin-left: auto;
  font-size: 1.2rem;
  color: #333;
  transition: 0.3s;
}

.social-card:hover .arrow {
  color: var(--brand-green);
  transform: translateX(5px);
}

/* Hover Accent Borders */
.youtube:hover { border-left: 4px solid #FF0000; }
.tiktok:hover { border-left: 4px solid #fe2c55; }
.tindie:hover { border-left: 4px solid #ffaa00; }

@media (max-width: 600px) {
  .socials-container {
    padding: 1rem;
    min-height: calc(100vh - 80px);
  }
  
  h1 {
    font-size: 2.2rem;
  }

  .social-card {
    padding: 1rem 1.5rem;
  }
}
</style>