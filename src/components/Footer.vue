<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase' // Double check this path points to your supabase.ts file

const viewCount = ref<number | string>('...')

const fetchViews = async () => {
  try {
    // We select the 'count' column where 'counter_name' matches 'total_views'
    const { data, error } = await supabase
      .from('site-stats')
      .select('count')
      .eq('counter_name', 'total_views')
      .single()

    if (error) throw error
    
    if (data) {
      viewCount.value = data.count
    }
  } catch (err) {
    console.error('Error fetching views:', err)
    viewCount.value = '?' // Fallback if database fails
  }
}

onMounted(() => {
  fetchViews()
})
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      
      <div class="footer-col brand">
        <img src="/images/ZeugUndKramFlach.png" alt="Logo" class="footer-logo" />
        
        <p class="brand-text visitor-counter">
          Seitenaufrufe: <span class="count-number">{{ viewCount }}</span>
        </p>
        
        <a href="#" class="status-btn">Zur Status Webseite ↗</a>
      </div>

      <div class="links-group">
        <div class="footer-col">
          <h4>Leistungen</h4>
          <ul>
            <li><a href="#">Entwicklung</a></li>
            <li><a href="#">Hosting</a></li>
            <li><a href="#">Betrieb</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Portfolio</a></li>
            <li><a href="/privacy">Datenschutz</a></li>
            <li><router-link to="/legal">Impressum</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Kontakt</h4>
          <p class="email-text">zeugkramdinge@gmail.com</p>
          <div class="socials">
            <a href="#" class="soc" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" class="soc" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="soc" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.02.23 2.1 1.01 2.78.81.71 1.96.96 3 .67 1.07-.3 1.88-1.25 2.12-2.33.19-.84.2-1.7.21-2.55V.02z"/></svg>
            </a>
          </div>
        </div>
      </div>

    </div>
    
    <div class="copyright">
      Zeug & Kram &copy; 2026
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: #000;
  padding: 6rem 0 0 0;
  border-top: 1px solid #111;
  font-family: 'Varela Round', sans-serif;
}

.footer-content {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;
}

.links-group {
  display: flex;
  flex: 3;
  justify-content: space-between;
  gap: 2rem;
}

.footer-col {
  min-width: 150px;
}

.brand {
  flex: 1.5;
  max-width: 400px;
}

.footer-logo {
  height: 45px;
  width: auto;
  margin-bottom: 2rem;
}

/* Visitor Counter Styles */
.visitor-counter {
  font-family: 'Exo', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.count-number {
  color: var(--brand-green);
  font-weight: 900;
  margin-left: 5px;
}

.brand-text {
  color: #aaa;
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.email-text {
  color: #89BD8B;
  font-family: 'Exo', sans-serif;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

h4 {
  font-family: 'Exo', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #89BD8B;
}

.status-btn {
  display: inline-block;
  font-family: 'Exo', sans-serif;
  padding: 0.7rem 1.4rem;
  background: #111;
  color: #eee;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid #222;
  transition: all 0.3s ease;
}

.status-btn:hover {
  border-color: #89BD8B;
  color: #89BD8B;
}

.socials {
  display: flex;
  gap: 12px;
}

.soc {
  width: 38px;
  height: 38px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #666;
  border: 1px solid #222;
  transition: all 0.3s ease;
}

.soc svg {
  width: 18px;
  height: 18px;
}

.soc:hover {
  color: #89BD8B;
  border-color: #89BD8B;
  transform: translateY(-3px);
}

.copyright {
  text-align: center;
  margin-top: 5rem;
  color: #333;
  font-size: 0.75rem;
  border-top: 1px solid #0a0a0a;
  padding: 2.5rem 0;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: 1px;
  font-family: 'Exo', sans-serif;
}

@media (max-width: 900px) {
  .footer-content {
    flex-direction: column;
    gap: 4rem;
    text-align: center;
  }
  
  .links-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem;
  }
  
  .brand {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .footer-logo {
    margin: 0 auto 2rem;
  }

  .socials {
    justify-content: center;
  }
}
</style>