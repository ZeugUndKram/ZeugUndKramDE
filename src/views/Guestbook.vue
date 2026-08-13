<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../supabase'

// Form state
const name = ref('')
const message = ref('')
const honeypot = ref('') // 🍯 The bot trap!
const isSending = ref(false)
const showSuccess = ref(false)

// Limits
const charLimit = 400
const charsLeft = computed(() => charLimit - message.value.length)

// Entries & Pagination state
const entries = ref<any[]>([])
const pageSize = 10
let currentPage = 0
const hasMore = ref(true)
const isLoadingMore = ref(false)

// Fetching logic (only loads approved, uses pagination)
const fetchEntries = async (loadMore = false) => {
  if (!loadMore) {
    currentPage = 0
    entries.value = []
  }
  
  const from = currentPage * pageSize
  const to = from + pageSize - 1
  isLoadingMore.value = true

  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .eq('is_approved', true) // Only grab approved messages
    .order('created_at', { ascending: false })
    .range(from, to) // Limit how many we grab

  isLoadingMore.value = false

  if (error) {
    console.error('Fehler beim Laden:', error)
    return
  }

  // Check if we hit the end of the database
  if (data.length < pageSize) {
    hasMore.value = false
  } else {
    hasMore.value = true
  }

  if (loadMore) {
    entries.value.push(...data)
  } else {
    entries.value = data
  }
}

const loadNextPage = () => {
  currentPage++
  fetchEntries(true)
}

// Submission logic
const handleSubmit = async () => {
  // 1. Check the Honeypot. If it's filled, it's a bot.
  if (honeypot.value !== '') {
    name.value = ''
    message.value = ''
    honeypot.value = ''
    showSuccess.value = true // Lie to the bot and say it worked
    return
  }

  // 2. Validate real users
  if (!name.value || !message.value || message.value.length > charLimit) return
  
  isSending.value = true
  
  // Note: Ensure your Supabase table has `is_approved` defaulting to `false`
  const { error } = await supabase
    .from('guestbook')
    .insert([{ name: name.value, message: message.value }])

  isSending.value = false

  if (error) {
    alert("Fehler beim Senden. Bitte später versuchen.")
  } else {
    name.value = ''
    message.value = ''
    showSuccess.value = true
    
    // Hide success message after 5 seconds
    setTimeout(() => { showSuccess.value = false }, 5000)
  }
}

onMounted(() => {
  fetchEntries()
})
</script>

<template>
  <div class="gb-page-wrapper">
    
    <div class="gb-layout">
      <div class="gb-entries-col">
        <h1 class="gb-title">Das Archiv</h1>
        
        <div class="entries-list">
          <div v-for="entry in entries" :key="entry.id" class="gb-card">
            <div class="gb-meta">
              <span class="gb-author">{{ entry.name }}</span>
              <span class="gb-date">{{ new Date(entry.created_at).toLocaleDateString('de-DE') }}</span>
            </div>
            <p class="gb-text">{{ entry.message }}</p>
          </div>

          <div class="load-more-wrapper" v-if="hasMore">
            <button @click="loadNextPage" :disabled="isLoadingMore" class="btn-secondary">
              {{ isLoadingMore ? 'Lade...' : 'Mehr laden ↓' }}
            </button>
          </div>
          <div v-else class="end-of-line">
            --- Ende des Archivs ---
          </div>
        </div>
      </div>

      <div class="gb-form-col">
        <div class="form-panel">
          <h2>Eintrag verfassen</h2>
          <p class="form-desc">Hinterlasse etwas für die Nachwelt</p>

          <form @submit.prevent="handleSubmit" class="gb-form">
            <input 
              v-model="honeypot" 
              type="text" 
              name="website_url" 
              tabindex="-1" 
              autocomplete="off"
              class="bot-trap" 
            />

            <input v-model="name" placeholder="Dein Name" required maxlength="50" />
            
            <div class="textarea-wrapper">
              <textarea 
                v-model="message" 
                placeholder="Was gibt's?" 
                rows="6" 
                required 
                :maxlength="charLimit"
              ></textarea>
              <span class="char-counter" :class="{ 'limit-reached': charsLeft <= 20 }">
                {{ charsLeft }}
              </span>
            </div>

            <button type="submit" :disabled="isSending || showSuccess" class="btn-primary">
              {{ isSending ? 'Wird gesendet...' : 'Eintragen ✍️' }}
            </button>
            
            <div v-if="showSuccess" class="success-msg">
              Danke! Dein Eintrag wird nach kurzer Prüfung freigeschaltet.
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Page Wrapper: Forces the height so the footer is just out of view */
/* Adjust the 80px based on your actual header height */
.gb-page-wrapper {
  height: calc(100vh - 80px); 
  display: flex;
  justify-content: center;
  overflow: hidden; /* Prevents the whole page from scrolling */
}

/* The split layout */
.gb-layout {
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 4rem;
  padding: 2rem;
  height: 100%;
}

/* --- LEFT SIDE: Scrolling Entries --- */
.gb-entries-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gb-title {
  font-family: var(--font-header);
  color: #fff;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.entries-list {
  flex: 1;
  overflow-y: auto; /* The independent scroll magic */
  padding-right: 1rem;
  padding-bottom: 2rem;
}

/* Custom Scrollbar for the entries list */
.entries-list::-webkit-scrollbar { width: 8px; }
.entries-list::-webkit-scrollbar-track { background: #111; border-radius: 4px; }
.entries-list::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
.entries-list::-webkit-scrollbar-thumb:hover { background: var(--brand-green); }

.gb-card {
  background: #151515;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 3px solid #333;
  transition: border-color 0.3s;
}

.gb-card:hover { border-color: var(--brand-green); }

.gb-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.gb-author {
  font-weight: 700;
  color: var(--brand-green);
  font-family: var(--font-header);
}

.gb-date { font-size: 0.8rem; color: #555; }
.gb-text { 
  color: #ccc; 
  line-height: 1.6; 
  white-space: pre-wrap; 
  
  /* Add these two lines to fix the stretching: */
  word-break: break-word; 
  overflow-wrap: break-word; 
}

/* Load More / End */
.load-more-wrapper { text-align: center; margin-top: 2rem; }
.end-of-line { text-align: center; color: #444; margin-top: 3rem; font-family: var(--font-header); }

/* --- RIGHT SIDE: Static Form --- */
.gb-form-col {
  width: 400px; /* Fixed width for the form panel */
  flex-shrink: 0;
  height: 100%;
}

.form-panel {
  background: #111;
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid #222;
  position: sticky;
  top: 0;
}

.form-panel h2 { color: var(--brand-green); font-family: var(--font-header); margin-bottom: 0.5rem; }
.form-desc { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }

.gb-form { display: flex; flex-direction: column; gap: 1.2rem; }

input, textarea {
  background: #080808;
  border: 1px solid #333;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-family: var(--font-body);
  width: 100%;
  box-sizing: border-box;
}

input:focus, textarea:focus { border-color: var(--brand-green); outline: none; }

.textarea-wrapper { position: relative; }

.char-counter {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 0.75rem;
  color: #666;
  font-family: var(--font-header);
}
.char-counter.limit-reached { color: #ff4a4a; font-weight: bold; }

.success-msg {
  color: var(--brand-green);
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(137, 189, 139, 0.1);
  border-radius: 8px;
}

/* THE HONEYPOT: Off-screen so humans don't see it, but bots do */
.bot-trap {
  position: absolute;
  left: -9999px;
  opacity: 0;
  z-index: -1;
}

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 900px) {
  .gb-page-wrapper {
    height: auto;
    overflow: visible;
  }
  .gb-layout {
    flex-direction: column;
    height: auto;
  }
  .gb-form-col { width: 100%; order: -1; /* Puts form on top on mobile */ }
  .entries-list { overflow-y: visible; padding-right: 0; }
}
</style>