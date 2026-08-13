<template>
  <div class="gw">
    <div class="screen">
 
      <!-- HUD -->
      <div class="hud">
        <div class="hud-s">
          <div class="hl">SCORE</div>
          <div class="hv">{{ pad(score, 6) }}</div>
        </div>
        <div class="hud-m">
          <div class="stars-row">
            <span v-for="n in 3" :key="n" :class="['star', { lit: n <= stars }]">★</span>
          </div>
          <div class="rnd">ROUND {{ round }}</div>
        </div>
        <div class="hud-t">
          <div class="hl">TIME</div>
          <div :class="['hv', { warn: timeLeft < 30 }]">{{ fmtTime }}</div>
        </div>
      </div>
 
      <!-- Health bars -->
      <div class="bars">
        <div class="brow">
          <span class="bname mac-n">MAC</span>
          <div class="btrack"><div class="bfill mf" :style="{ width: macHealth + '%' }"></div></div>
        </div>
        <div class="brow">
          <span class="bname joe-n">JOE</span>
          <div class="btrack"><div class="bfill jf" :style="{ width: joeHealth + '%' }"></div></div>
        </div>
      </div>
 
      <!-- Hearts (stamina) -->
      <div class="hearts-row">
        <span v-for="n in MAX_HEARTS" :key="n" :class="['hpip', { on: n <= hearts }]">♥</span>
      </div>
 
      <!-- Arena -->
      <div class="arena">
        <div class="rbg">
          <div class="crowd"></div>
          <div class="rope rp1"></div>
          <div class="rope rp2"></div>
          <div class="rfloor"></div>
        </div>
 
        <!-- Screen flash overlay -->
        <div :class="['sflash', flashCls]"></div>
 
        <!-- Glass Joe -->
        <div class="joe-wrap">
          <img
            :class="['joe-img', {
              'hit-glow': joe.state === 'hit_react',
              'charge-glow': joe.state === 'tell' && joe.move?.id === 'heavy_hook',
              'stun-filter': joe.state === 'stunned'
            }]"
            :src="`/punchoutsprites/glass joe/${joe.sprite}.png`"
            alt="Glass Joe"
          />
          <div v-if="gs === 'knockdown' && kdTarget === 'joe'" class="kd-num">{{ kdCount }}</div>
        </div>
 
        <!-- Little Mac -->
        <div class="mac-wrap">
          <img
            :class="['mac-img', {
              'hit-glow': mac.state === 'hit_face' || mac.state === 'hit_stomach',
              'stun-filter': mac.state === 'stunned'
            }]"
            :src="`/punchoutsprites/mac/${mac.sprite}.png`"
            :style="{ transform: `scaleX(${mac.flip ? -1 : 1})` }"
            alt="Little Mac"
          />
          <div v-if="gs === 'knockdown' && kdTarget === 'mac'" class="kd-num mac-kd">{{ kdCount }}</div>
        </div>
 
        <!-- Floating popup text -->
        <Transition name="ppop">
          <div v-if="pp.active" class="popup" :style="{ left: pp.x + 'px', top: pp.y + 'px' }">{{ pp.text }}</div>
        </Transition>
 
        <!-- Get up prompt -->
        <div v-if="gs === 'knockdown' && kdTarget === 'mac'" class="getup blink">PRESS ANY KEY TO GET UP!</div>
      </div>
 
      <!-- MENU overlay -->
      <Transition name="ov">
        <div v-if="gs === 'menu'" class="overlay">
          <div class="menu-title">
            <div class="mt1">MIKE TYSON'S</div>
            <div class="mt2">PUNCH-OUT!!</div>
          </div>
          <div class="blink press-txt">PRESS ENTER TO START</div>
          <div class="ctrls">
            <div class="crow"><kbd>A</kbd> Left Jab</div>
            <div class="crow"><kbd>D</kbd> Right Jab</div>
            <div class="crow"><kbd>S</kbd> Star Punch ★</div>
            <div class="crow"><kbd>← →</kbd> Dodge</div>
            <div class="crow"><kbd>↑</kbd> Block (hold)</div>
          </div>
          <div class="tip">Counter Joe's wind-up to earn ★</div>
        </div>
      </Transition>
 
      <!-- COUNTDOWN overlay -->
      <Transition name="ov">
        <div v-if="gs === 'countdown'" class="overlay cd-ov">
          <div class="cd-num" :key="cdN">{{ cdN === 0 ? 'FIGHT!' : cdN }}</div>
        </div>
      </Transition>
 
      <!-- RESULT overlay -->
      <Transition name="ov">
        <div v-if="gs === 'result'" class="overlay res-ov">
          <div class="res-type">{{ resType }}</div>
          <div class="res-line">{{ resLine }}</div>
          <div class="res-score">SCORE {{ pad(score, 6) }}</div>
          <div class="blink press-txt" style="margin-top:18px">PRESS ENTER</div>
        </div>
      </Transition>
 
    </div>
 
    <!-- Touch / Mouse controls -->
    <div class="touch-ctrl">
      <div class="tc-left">
        <button class="tb"
                @touchstart.prevent="handleKey('ArrowLeft')"
                @mousedown.prevent="handleKey('ArrowLeft')">◀</button>
        <button class="tb"
                @touchstart.prevent="blockHeld = true"
                @touchend.prevent="blockHeld = false"
                @mousedown.prevent="blockHeld = true"
                @mouseup.prevent="blockHeld = false">▲</button>
        <button class="tb"
                @touchstart.prevent="handleKey('ArrowRight')"
                @mousedown.prevent="handleKey('ArrowRight')">▶</button>
      </div>
      <div class="tc-right">
        <button class="tb ta"
                @touchstart.prevent="handleKey('a')"
                @mousedown.prevent="handleKey('a')">A</button>
        <button class="tb td"
                @touchstart.prevent="handleKey('d')"
                @mousedown.prevent="handleKey('d')">D</button>
        <button class="tb ts"
                @touchstart.prevent="handleKey('s')"
                @mousedown.prevent="handleKey('s')">★</button>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
 
// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const MAX_HEARTS = 6
const MAX_STARS  = 3
const ROUND_SECS = 180
 
// Glass Joe's three attack types.
// tellSpr  = sprite shown during the telegraph window
// tellF    = frames of telegraph (counter window for heavy_hook)
// atkSpr   = sprite during the actual punch
// atkF     = frames the punch hitbox is active
// recF     = recovery frames (Joe is vulnerable but not telegraphing)
// zone     = 'face' | 'body'  → determines which hit sprite Mac uses
// dmg      = HP damage if Mac does nothing
// canBlock = whether Mac's block reduces this attack
// earnStar = whether countering during tell earns a star
const MOVES = [
  { id: 'jab_face',   tellSpr: 'punch',              tellF: 22, atkSpr: 'punch',       atkF: 12, recF: 24, zone: 'face', dmg: 8,  canBlock: true,  earnStar: false },
  { id: 'body_blow',  tellSpr: 'punch_heavy',        tellF: 28, atkSpr: 'punch_heavy', atkF: 14, recF: 30, zone: 'body', dmg: 13, canBlock: true,  earnStar: false },
  { id: 'heavy_hook', tellSpr: 'punch_heavy_charge', tellF: 60, atkSpr: 'punch_heavy', atkF: 18, recF: 45, zone: 'face', dmg: 26, canBlock: false, earnStar: true  },
]
 
// ─── STATE ───────────────────────────────────────────────────────────────────
const gs         = ref('menu')   // menu | countdown | playing | knockdown | result
const score      = ref(0)
const round      = ref(1)
const frame      = ref(0)
const timeLeft   = ref(ROUND_SECS)
const hearts     = ref(MAX_HEARTS)
const stars      = ref(0)
const macHealth  = ref(100)
const joeHealth  = ref(100)
const kdTarget   = ref(null)     // 'mac' | 'joe'
const kdCount    = ref(0)
const cdN        = ref(3)
const resType    = ref('')
const resLine    = ref('')
const flashCls   = ref('')
const blockHeld  = ref(false)    // mobile block button held
const pp         = ref({ active: false, text: '', x: 0, y: 0 })
 
// Actor objects — plain reactive fields inside a ref
const mac = ref({ state: 'idle', sprite: 'idle', flip: false, timer: 0 })
const joe = ref({ state: 'idle', sprite: 'idle', timer: 0, move: null })
 
// Keys currently held on keyboard
const keysHeld = new Set()
 
// Loop / interval handles
let raf        = null
let kdInterval = null
let kdGetUpCb  = null
let flashTout  = null
let ppTout     = null
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
const pad = (n, l) => String(Math.max(0, Math.floor(n))).padStart(l, '0')
 
const fmtTime = computed(() => {
  const t = Math.max(0, Math.ceil(timeLeft.value))
  return `${Math.floor(t / 60)}:${pad(t % 60, 2)}`
})
 
// Joe idle duration scales with his remaining health (he gets faster when hurt)
const jitterIdle = () => {
  const f = joeHealth.value / 100
  return Math.floor((55 + Math.random() * 75) * f + 35)
}
 
const trigFlash = (cls, ms = 130) => {
  flashCls.value = cls
  clearTimeout(flashTout)
  flashTout = setTimeout(() => { flashCls.value = '' }, ms)
}
 
const showPopup = (text, x = 188, y = 108) => {
  pp.value = { active: true, text, x, y }
  clearTimeout(ppTout)
  ppTout = setTimeout(() => { pp.value = { ...pp.value, active: false } }, 950)
}
 
// ─── GAME MANAGEMENT ─────────────────────────────────────────────────────────
const resetAll = () => {
  score.value = 0;  round.value = 1;  frame.value = 0
  timeLeft.value = ROUND_SECS;  hearts.value = MAX_HEARTS;  stars.value = 0
  macHealth.value = 100;  joeHealth.value = 100
  mac.value = { state: 'idle', sprite: 'idle', flip: false, timer: 0 }
  joe.value = { state: 'idle', sprite: 'idle', timer: jitterIdle(), move: null }
  kdTarget.value = null;  kdCount.value = 0
  flashCls.value = '';  pp.value.active = false
}
 
const startGame = () => {
  resetAll()
  gs.value = 'countdown';  cdN.value = 3
  const tick = () => {
    if (cdN.value > 1) { cdN.value--;  setTimeout(tick, 800) }
    else { cdN.value = 0;  setTimeout(() => { gs.value = 'playing';  raf = requestAnimationFrame(gameLoop) }, 700) }
  }
  setTimeout(tick, 800)
}
 
const doKnockdown = (target) => {
  cancelAnimationFrame(raf);  raf = null
  gs.value = 'knockdown';  kdTarget.value = target;  kdCount.value = 1
 
  if (target === 'joe') {
    joe.value.sprite = 'knockout';  joe.value.state = 'down'
    startKdCount(() => endGame('K.O.!', 'YOU WIN!', true), null)
  } else {
    mac.value.sprite = 'knockout';  mac.value.state = 'knockout'
    startKdCount(
      () => endGame('K.O.!', 'GLASS JOE WINS!', false),
      () => {
        // Player mashed — Mac gets up
        macHealth.value = Math.max(5, macHealth.value)
        hearts.value = Math.max(1, MAX_HEARTS - 3)
        mac.value = { state: 'idle', sprite: 'idle', flip: false, timer: 0 }
        gs.value = 'playing';  raf = requestAnimationFrame(gameLoop)
      }
    )
  }
}
 
const startKdCount = (onFall, onGetUp) => {
  kdGetUpCb = onGetUp;  kdCount.value = 1
  kdInterval = setInterval(() => {
    kdCount.value++
    if (kdCount.value >= 10) {
      clearInterval(kdInterval);  kdInterval = null;  kdGetUpCb = null
      setTimeout(onFall, 600)
    }
  }, 700)
}
 
const endGame = (type, line, won) => {
  clearInterval(kdInterval);  kdInterval = null
  cancelAnimationFrame(raf);  raf = null
  gs.value = 'result';  resType.value = type;  resLine.value = line
  if (won) { mac.value.sprite = 'win';  joe.value.sprite = 'knockout' }
  else     { mac.value.sprite = 'knockout';  joe.value.sprite = 'win' }
}
 
// ─── GAME LOOP ────────────────────────────────────────────────────────────────
const gameLoop = () => {
  if (gs.value !== 'playing') return
  frame.value++
 
  // Countdown round timer at 60 fps
  if (frame.value % 60 === 0) {
    timeLeft.value = Math.max(0, timeLeft.value - 1)
    if (timeLeft.value <= 0) {
      const won = macHealth.value >= joeHealth.value
      endGame('TIME!', won ? 'YOU WIN!' : 'GLASS JOE WINS!', won)
      return
    }
  }
 
  tickMac()
  tickJoe()
  raf = requestAnimationFrame(gameLoop)
}
 
// ─── MAC TICK ────────────────────────────────────────────────────────────────
const tickMac = () => {
  const vulnerable = ['hit_face', 'hit_stomach', 'stunned', 'knockout']
  const shouldBlock = (keysHeld.has('ArrowUp') || blockHeld.value) && !vulnerable.includes(mac.value.state)
 
  if (shouldBlock) {
    mac.value.state = 'block';  mac.value.sprite = 'block';  mac.value.timer = 0
    return
  }
 
  if (mac.value.timer > 0) { mac.value.timer--;  return }
 
  const transient = ['punch', 'punch_heavy', 'block', 'dodge', 'hit_face', 'hit_stomach', 'stunned']
  if (transient.includes(mac.value.state)) {
    mac.value.state = 'idle';  mac.value.sprite = 'idle';  mac.value.flip = false
  }
 
  // Slowly regen hearts while idle
  if (mac.value.state === 'idle' && frame.value % 150 === 0 && hearts.value < MAX_HEARTS) {
    hearts.value++
  }
}
 
// ─── JOE TICK ────────────────────────────────────────────────────────────────
const tickJoe = () => {
  // States that just count down then return to idle
  if (['hit_react', 'stunned', 'down'].includes(joe.value.state)) {
    if (joe.value.timer > 0) { joe.value.timer--;  return }
    if (joe.value.state !== 'down') {
      joe.value.state = 'idle';  joe.value.sprite = 'idle'
      joe.value.move = null;  joe.value.timer = jitterIdle()
    }
    return
  }
 
  if (joe.value.timer > 0) { joe.value.timer--;  return }
 
  switch (joe.value.state) {
    case 'idle': {
      // Pick next attack (heavy hook more common as HP drops)
      const heavyChance = 0.30 + (1 - joeHealth.value / 100) * 0.20
      const r = Math.random()
      const m = r < 0.30 ? MOVES[0] : r < (0.60 - heavyChance * 0.1) ? MOVES[1] : MOVES[2]
      joe.value.move = m
      joe.value.state = 'tell'
      joe.value.sprite = m.tellSpr
      joe.value.timer = m.tellF
      break
    }
    case 'tell': {
      // Telegraph done — attack!
      joe.value.state = 'attack'
      joe.value.sprite = joe.value.move.atkSpr
      joe.value.timer = joe.value.move.atkF
      resolveJoeAttack()
      break
    }
    case 'attack': {
      joe.value.state = 'recover'
      joe.value.sprite = 'idle'
      joe.value.timer = joe.value.move.recF
      break
    }
    case 'recover': {
      joe.value.state = 'idle'
      joe.value.sprite = 'idle'
      joe.value.move = null
      joe.value.timer = jitterIdle()
      break
    }
  }
}
 
// ─── JOE ATTACK RESOLUTION ───────────────────────────────────────────────────
const resolveJoeAttack = () => {
  const m  = joe.value.move
  const ms = mac.value.state
 
  if (ms === 'dodge') {
    showPopup('DODGE! +50', 115, 165)
    score.value += 50
    return
  }
 
  if (ms === 'block') {
    if (!m.canBlock) {
      // Heavy hook breaks through blocks
      showPopup("CAN'T BLOCK!", 138, 132)
      hitMac(m.zone, m.dmg)
    } else {
      hearts.value = Math.max(0, hearts.value - 2)
      showPopup('BLOCK!', 188, 142)
      trigFlash('flash-red', 80)
      if (hearts.value <= 0) stunMac()
    }
    return
  }
 
  // Mac was idle / punching / in wrong state — take full hit
  hitMac(m.zone, m.dmg)
}
 
const hitMac = (zone, dmg) => {
  mac.value.state  = zone === 'face' ? 'hit_face' : 'hit_stomach'
  mac.value.sprite = mac.value.state
  mac.value.timer  = 22
  macHealth.value  = Math.max(0, macHealth.value - dmg)
  hearts.value     = Math.max(0, hearts.value - 2)
  trigFlash('flash-red')
  showPopup('OOF!', 162, 158)
  if (macHealth.value <= 0) { doKnockdown('mac');  return }
  if (hearts.value <= 0) stunMac()
}
 
const stunMac = () => {
  mac.value.state  = 'stunned'
  mac.value.sprite = 'stunned'
  mac.value.timer  = 90
  showPopup('STUNNED!', 152, 132)
}
 
// ─── MAC PUNCH RESOLUTION ────────────────────────────────────────────────────
const resolveMacPunch = (type) => {
  const js = joe.value.state
  const jm = joe.value.move
 
  // ★ COUNTER — interrupt Joe's heavy hook wind-up
  if (js === 'tell' && jm?.id === 'heavy_hook') {
    joe.value.state  = 'hit_react'
    joe.value.sprite = 'hit_face'
    joe.value.timer  = 42
    const dmg = type === 'star' ? 50 : 20
    const pts = type === 'star' ? 1000 : 400
    joeHealth.value  = Math.max(0, joeHealth.value - dmg)
    score.value     += pts
    trigFlash('flash-white', 200)
    if (type !== 'star') {
      stars.value = Math.min(MAX_STARS, stars.value + 1)
      showPopup('COUNTER! ★ +1', 178, 92)
    } else {
      showPopup('STAR K.O.!!', 182, 92)
    }
    if (joeHealth.value <= 0) { doKnockdown('joe');  return }
    return
  }
 
  // CLEAN HIT — Joe idle, recovering, hit-reacting, or in non-heavy tell
  const hitWindow = ['idle', 'recover', 'hit_react']
  const inTellBut = js === 'tell' && jm?.id !== 'heavy_hook'
  if (hitWindow.includes(js) || inTellBut) {
    joe.value.state  = 'hit_react'
    joe.value.sprite = (type === 'star' || Math.random() < 0.4) ? 'hit_face' : 'hit_stomach'
    joe.value.timer  = 24
    const dmg = type === 'star' ? 50 : 8
    const pts = type === 'star' ? 500 : 100
    joeHealth.value  = Math.max(0, joeHealth.value - dmg)
    score.value     += pts
    trigFlash('flash-white', 80)
    showPopup(type === 'star' ? '★ STAR PUNCH!' : `+${pts}`, 188, 98)
    if (joeHealth.value <= 0) { doKnockdown('joe');  return }
    return
  }
 
  // MISS — Joe is attacking; Mac loses a heart
  hearts.value = Math.max(0, hearts.value - 1)
  showPopup('MISS!', 198, 158)
  if (hearts.value <= 0) stunMac()
}
 
// ─── INPUT ───────────────────────────────────────────────────────────────────
const handleKey = (key) => {
  // Menu / result → Enter starts game
  if (gs.value === 'menu' || gs.value === 'result') {
    if (key === 'Enter') startGame()
    return
  }
 
  // Knockdown → any key = Mac tries to get up
  if (gs.value === 'knockdown') {
    if (kdTarget.value === 'mac' && kdGetUpCb) {
      clearInterval(kdInterval);  kdInterval = null
      const cb = kdGetUpCb;  kdGetUpCb = null;  cb()
    }
    return
  }
 
  if (gs.value !== 'playing') return
 
  const k  = key.toLowerCase()
  const ms = mac.value.state
 
  // Can't act while stunned or knocked out
  if (ms === 'stunned' || ms === 'knockout') return
  // Can't act mid-punch or mid-hit
  if (['punch', 'punch_heavy', 'hit_face', 'hit_stomach'].includes(ms)) return
 
  if (k === 'arrowleft') {
    mac.value.state = 'dodge';  mac.value.sprite = 'dodge'
    mac.value.flip = false;     mac.value.timer  = 24
  } else if (k === 'arrowright') {
    mac.value.state = 'dodge';  mac.value.sprite = 'dodge'
    mac.value.flip = true;      mac.value.timer  = 24
  } else if (k === 'a') {
    if (hearts.value <= 0) { stunMac();  return }
    mac.value.state = 'punch';  mac.value.sprite = 'punch'
    mac.value.flip  = false;    mac.value.timer  = 15
    resolveMacPunch('normal')
  } else if (k === 'd') {
    if (hearts.value <= 0) { stunMac();  return }
    mac.value.state = 'punch';  mac.value.sprite = 'punch'
    mac.value.flip  = true;     mac.value.timer  = 15
    resolveMacPunch('normal')
  } else if (k === 's') {
    if (stars.value <= 0 || hearts.value <= 0) return
    stars.value--
    mac.value.state = 'punch_heavy';  mac.value.sprite = 'punch_heavy'
    mac.value.timer = 28
    resolveMacPunch('star')
  }
}
 
const onKD = (e) => { keysHeld.add(e.key);  handleKey(e.key) }
const onKU = (e) =>   keysHeld.delete(e.key)
 
onMounted(() => {
  window.addEventListener('keydown', onKD)
  window.addEventListener('keyup',   onKU)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKD)
  window.removeEventListener('keyup',   onKU)
  cancelAnimationFrame(raf)
  clearInterval(kdInterval)
  clearTimeout(flashTout)
  clearTimeout(ppTout)
})
</script>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
 
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
/* ── WRAPPER ── */
.gw {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 40%, #12042a 0%, #040010 100%);
  font-family: 'Press Start 2P', cursive;
  gap: 10px;
  padding: 12px;
}
 
/* ── SCREEN ── */
.screen {
  position: relative;
  width: 560px;
  background: #000;
  border: 3px solid #eee;
  box-shadow:
    0 0 0 1px #000,
    0 0 50px rgba(255, 60, 20, 0.25),
    0 0 100px rgba(20, 80, 255, 0.15);
  overflow: hidden;
}
 
/* ── HUD ── */
.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #000;
  border-bottom: 2px solid #1a1a1a;
  min-height: 40px;
}
.hud-m { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.hl    { font-size: 6px; color: #555; margin-bottom: 1px; }
.hv    { font-size: 11px; color: #fff; }
.hv.warn { color: #ff2222; animation: twarn 0.45s step-end infinite; }
@keyframes twarn { 0%,100%{opacity:1} 50%{opacity:0.15} }
 
.stars-row { display: flex; gap: 6px; }
.star      { font-size: 14px; color: #2a2a00; transition: color 0.1s, text-shadow 0.1s; }
.star.lit  { color: #ffdd00; text-shadow: 0 0 8px #ff0, 0 0 16px #a80; }
.rnd       { font-size: 6px; color: #666; margin-top: 1px; }
 
/* ── HEALTH BARS ── */
.bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 5px 10px;
  background: #000;
  border-bottom: 1px solid #1a1a1a;
}
.brow { display: flex; align-items: center; gap: 8px; }
.bname { font-size: 7px; width: 30px; }
.mac-n { color: #44ddff; }
.joe-n { color: #ff6644; }
.btrack {
  flex: 1; height: 9px;
  background: #111; border: 1px solid #333; overflow: hidden;
}
.bfill { height: 100%; transition: width 0.12s; }
.mf { background: linear-gradient(90deg, #00cc00, #88ff00); }
.jf { background: linear-gradient(90deg, #cc2200, #ff8800); }
 
/* ── HEARTS / STAMINA ── */
.hearts-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
  background: #000;
  border-bottom: 2px solid #111;
}
.hpip     { font-size: 13px; color: #200000; transition: color 0.1s, text-shadow 0.1s; }
.hpip.on  { color: #ff3333; text-shadow: 0 0 5px #f44; }
 
/* ── ARENA ── */
.arena {
  position: relative;
  width: 100%;
  height: 355px;
  overflow: hidden;
}
 
/* Ring layers */
.rbg { position: absolute; inset: 0; }
 
.crowd {
  position: absolute;
  top: 0; left: 0; right: 0; height: 45%;
  background: #0d0820;
  overflow: hidden;
}
.crowd::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(#ffaa33 1.5px, transparent 1.5px),
    radial-gradient(#ff4444 1.5px, transparent 1.5px),
    radial-gradient(#ffffff 1.5px, transparent 1.5px),
    radial-gradient(#44aaff 1.5px, transparent 1.5px),
    radial-gradient(#44ff88 1.5px, transparent 1.5px),
    radial-gradient(#ff44ff 1.5px, transparent 1.5px),
    radial-gradient(#ffff44 1.5px, transparent 1.5px);
  background-size: 72px 28px, 65px 22px, 80px 32px, 58px 20px, 70px 28px, 62px 24px, 84px 30px;
  background-position: 5px 4px, 18px 11px, 40px 2px, 12px 18px, 52px 9px, 30px 19px, 0px 14px;
  opacity: 0.55;
}
.crowd::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 35%;
  background: linear-gradient(to bottom, transparent, #0d0820 95%);
}
 
/* Ropes */
.rope {
  position: absolute;
  left: 0; right: 0; height: 5px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #fffacc, #e8c800, #907800);
  box-shadow: 0 2px 5px rgba(0,0,0,0.6), 0 0 8px rgba(200,160,0,0.3);
}
.rp1 { top: 42%; }
.rp2 { top: 50%; }
 
/* Ring canvas floor */
.rfloor {
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 57%;
  background: linear-gradient(165deg, #1d3db8 0%, #2248d0 25%, #1a38a2 65%, #122882 100%);
  border-top: 4px solid #fff;
}
.rfloor::before {
  content: '';
  position: absolute;
  top: 0; left: 8%; right: 8%; bottom: 0;
  border-left: 2px solid rgba(255,255,255,0.07);
  border-right: 2px solid rgba(255,255,255,0.07);
}
.rfloor::after {
  content: '';
  position: absolute;
  top: 25%; left: 22%; right: 22%; bottom: 0;
  border: 2px solid rgba(255,255,255,0.05);
  border-bottom: none;
}
 
/* ── SCREEN FLASH ── */
.sflash {
  position: absolute; inset: 0; z-index: 50; pointer-events: none;
  opacity: 0; transition: opacity 0.04s;
}
.sflash.flash-red   { background: rgba(255,0,0,0.35);   opacity: 1; }
.sflash.flash-white { background: rgba(255,255,255,0.5); opacity: 1; }
 
/* ── JOE SPRITE ── */
.joe-wrap {
  position: absolute;
  bottom: 45%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.joe-img {
  height: 195px;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  transition: filter 0.07s;
}
.joe-img.hit-glow   { filter: brightness(3) sepia(1) saturate(5) hue-rotate(-8deg); }
.joe-img.stun-filter{ filter: sepia(1) hue-rotate(270deg) saturate(4) brightness(0.85); }
.joe-img.charge-glow{ animation: chargePulse 0.35s ease-in-out infinite alternate; }
@keyframes chargePulse {
  from { filter: drop-shadow(0 0 5px #ff8800) brightness(1.05); }
  to   { filter: drop-shadow(0 0 18px #ff4400) brightness(1.45); }
}
 
/* ── MAC SPRITE ── */
.mac-wrap {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
.mac-img {
  height: 155px;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  transition: filter 0.07s;
}
.mac-img.hit-glow   { filter: brightness(3) sepia(1) saturate(5) hue-rotate(-8deg); }
.mac-img.stun-filter{ filter: sepia(1) hue-rotate(200deg) saturate(4) brightness(0.9); }
 
/* ── KNOCKDOWN COUNT ── */
.kd-num {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 34px; color: #fff;
  text-shadow: 3px 3px 0 #000, 0 0 14px #f80;
  z-index: 10; pointer-events: none;
}
.mac-kd { top: 10%; font-size: 26px; color: #ffee00; }
 
/* ── POPUP TEXT ── */
.popup {
  position: absolute;
  font-size: 9px; color: #ffee00;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  z-index: 20; pointer-events: none; white-space: nowrap;
}
.ppop-enter-active { animation: ppIn 0.18s ease; }
.ppop-leave-active { animation: ppOut 0.5s ease; }
@keyframes ppIn  { from{transform:scale(0.4) translateY(12px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
@keyframes ppOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
 
/* ── GET UP PROMPT ── */
.getup {
  position: absolute;
  bottom: 8px; left: 50%;
  transform: translateX(-50%);
  font-size: 7px; color: #ffee00;
  text-shadow: 1px 1px 0 #000;
  z-index: 60; white-space: nowrap;
}
 
/* ── OVERLAYS ── */
.overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.88);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 100; gap: 15px;
}
 
/* Menu */
.menu-title { text-align: center; }
.mt1 { font-size: 9px;  color: #999; letter-spacing: 2px; margin-bottom: 8px; }
.mt2 { font-size: 27px; color: #ff2222; text-shadow: 3px 3px 0 #880000, 0 0 22px #f84; letter-spacing: 3px; }
 
.press-txt { font-size: 9px; color: #ffee00; }
 
.ctrls { display: flex; flex-direction: column; gap: 7px; margin-top: 2px; }
.crow  { font-size: 8px; color: #88ffaa; display: flex; align-items: center; gap: 10px; }
kbd {
  background: #222; border: 1px solid #555; border-radius: 3px;
  padding: 2px 6px; font-family: inherit; font-size: 7px; color: #fff;
  min-width: 28px; text-align: center;
}
.tip { font-size: 7px; color: #ff8800; text-align: center; line-height: 1.6; }
 
/* Countdown */
.cd-ov { background: rgba(0,0,0,0.65); }
.cd-num {
  font-size: 82px; color: #fff;
  text-shadow: 4px 4px 0 #cc0000, 0 0 35px #f84;
  animation: cdpop 0.38s ease-out;
}
@keyframes cdpop { from{transform:scale(2.5);opacity:0} to{transform:scale(1);opacity:1} }
 
/* Result */
.res-ov  { gap: 14px; }
.res-type  { font-size: 44px; color: #ff2200; text-shadow: 4px 4px 0 #880000; }
.res-line  { font-size: 14px; color: #ffee00; }
.res-score { font-size: 10px; color: #aaa; }
 
/* Blink utility */
.blink { animation: blinkA 1s step-end infinite; }
@keyframes blinkA { 0%,100%{opacity:1} 50%{opacity:0} }
 
/* Overlay transition */
.ov-enter-active, .ov-leave-active { transition: opacity 0.25s; }
.ov-enter-from, .ov-leave-to       { opacity: 0; }
 
/* ── TOUCH CONTROLS ── */
.touch-ctrl {
  display: flex;
  justify-content: space-between;
  width: 560px;
  padding: 6px 8px;
}
.tc-left, .tc-right { display: flex; gap: 8px; align-items: center; }
.tb {
  width: 54px; height: 50px;
  background: #181818; border: 2px solid #444; border-radius: 8px;
  color: #fff; font-family: inherit; font-size: 13px;
  cursor: pointer; user-select: none; -webkit-user-select: none;
  touch-action: manipulation;
  transition: background 0.08s, transform 0.08s;
}
.tb:active { background: #333; transform: scale(0.88); }
.ta { border-color: #f44; background: #3a0000; }
.ta:active { background: #600000; }
.td { border-color: #4f4; background: #003300; }
.td:active { background: #005500; }
.ts { border-color: #ff0; background: #2e2a00; font-size: 18px; }
.ts:active { background: #555000; }
 
@media (max-width: 600px) {
  .screen, .touch-ctrl { width: 100vw; }
  .arena   { height: 295px; }
  .joe-img { height: 158px; }
  .mac-img { height: 125px; }
  .mt2     { font-size: 20px; }
}
</style>
