<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import {
  BAR,
  BUTTON,
  YELLOW_FROM,
  GREEN_FROM,
  PERFECT,
  MISS_PENALTY,
  barX,
  speedAt,
  zoneAt,
  precisionAt,
  creditFor,
  ratingFor,
  tempAt,
} from '../../game/oven'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Ofen, Bedienfeld und Anzeige sind hier als SVG
// gezeichnet. Zonen, Tempo und Wertung stehen in game/oven.ts.

const props = withDefaults(
  defineProps<{
    goal: number
    active: boolean
    /** Was hinter der Scheibe liegt — der Ofen kommt zweimal im Rezept vor. */
    content?: 'raw' | 'wrapped'
  }>(),
  { content: 'raw' },
)

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400
// Groesster Zeitschritt pro Bild: nach einem Tab-Wechsel soll der Zeiger nicht
// in einem Sprung durch die ganze Skala schiessen.
const MAX_FRAME = 0.05

type Status = 'idle' | 'running' | 'done'

const status = ref<Status>('idle')
const pos = ref(0)
/** Wertung jedes Treffers, 0..1 */
const credits = ref<number[]>([])
const misses = ref(0)
const note = ref('')
const foul = ref(false)

let frame: number | undefined
let last = 0
let foulTimer: ReturnType<typeof setTimeout> | undefined

const hits = computed(() => credits.value.length)
const started = computed(() => status.value !== 'idle' || hits.value > 0 || misses.value > 0)
const accuracy = computed(() => {
  if (hits.value === 0) return 1
  const average = credits.value.reduce((sum, c) => sum + c, 0) / hits.value
  return average * MISS_PENALTY ** misses.value
})

// Der Ofen glueht mit dem Zeigerstand mit.
const glow = computed(() => (started.value ? 0.12 + 0.6 * pos.value : 0))

const hint = computed(() => {
  if (note.value) return note.value
  if (status.value === 'running') return 'Im grünen Feld stoppen'
  return 'Knopf drücken — Ofen an'
})

const state = (): TaskState => ({ done: hits.value, accuracy: accuracy.value })

const flagFoul = () => {
  foul.value = true
  if (foulTimer) clearTimeout(foulTimer)
  foulTimer = setTimeout(() => (foul.value = false), FOUL_MS)
}

const stopLoop = () => {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
}

const tick = (now: number) => {
  const dt = Math.min((now - last) / 1000, MAX_FRAME)
  last = now
  pos.value += speedAt(pos.value) * dt

  if (pos.value >= 1) {
    pos.value = 1
    // Durchgelaufen, ohne dass jemand gestoppt hat.
    miss('Verbrannt!')
    return
  }

  frame = requestAnimationFrame(tick)
}

const startRun = () => {
  pos.value = 0
  note.value = ''
  status.value = 'running'
  stopLoop()
  // Den ersten Zeitstempel aus dem ersten Bild nehmen, dann erst laufen lassen.
  frame = requestAnimationFrame((now) => {
    last = now
    frame = requestAnimationFrame(tick)
  })
}

const miss = (why: string) => {
  stopLoop()
  misses.value++
  note.value = why
  status.value = 'idle'
  flagFoul()
  emit('update', state())
}

const hit = () => {
  stopLoop()
  const precision = precisionAt(pos.value)
  credits.value.push(creditFor(precision))
  note.value = ratingFor(precision)
  status.value = hits.value >= props.goal ? 'done' : 'idle'
  emit('update', state())
  if (hits.value >= props.goal) emit('complete', state())
}

const press = () => {
  if (!props.active || status.value === 'done') return
  if (status.value === 'running') {
    if (zoneAt(pos.value) === 'gruen') hit()
    else miss(zoneAt(pos.value) === 'gelb' ? 'Fast — noch zu kalt' : 'Viel zu kalt')
    return
  }
  startRun()
}

// Ein-Knopf-Spiel: Leertaste und Enter tun dasselbe wie der Klick.
const onKey = (event: KeyboardEvent) => {
  if (event.repeat) return
  if (event.code !== 'Space' && event.code !== 'Enter') return
  if (!props.active) return
  event.preventDefault()
  press()
}

// Laeuft die Zeit ab, waehrend der Zeiger unterwegs ist, bleibt er stehen.
watch(
  () => props.active,
  (isActive) => {
    if (!isActive) {
      stopLoop()
      if (status.value === 'running') status.value = 'idle'
    }
  },
)

onMounted(() => window.addEventListener('keydown', onKey))

onUnmounted(() => {
  stopLoop()
  if (foulTimer) clearTimeout(foulTimer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="board">
    <TaskHint lead="Temperatur einstellen" :label="hint" :foul="foul" />

    <svg class="surface" :class="{ locked: !active }" viewBox="0 0 100 100">
      <!-- Korpus -->
      <rect class="body" x="8" y="8" width="84" height="84" rx="4" />

      <!-- Bedienfeld -->
      <rect class="panel" x="12" y="12" width="76" height="26" rx="2" />

      <!-- Display -->
      <rect class="display" x="16" y="14" width="52" height="22" rx="1.5" />

      <!-- Die drei Zonen -->
      <rect
        class="zone red"
        :x="BAR.left"
        :y="BAR.top"
        :width="barX(YELLOW_FROM) - BAR.left"
        :height="BAR.bottom - BAR.top"
      />
      <rect
        class="zone yellow"
        :x="barX(YELLOW_FROM)"
        :y="BAR.top"
        :width="barX(GREEN_FROM) - barX(YELLOW_FROM)"
        :height="BAR.bottom - BAR.top"
      />
      <rect
        class="zone green"
        :x="barX(GREEN_FROM)"
        :y="BAR.top"
        :width="BAR.right - barX(GREEN_FROM)"
        :height="BAR.bottom - BAR.top"
      />
      <rect
        class="bar-frame"
        :x="BAR.left"
        :y="BAR.top"
        :width="BAR.right - BAR.left"
        :height="BAR.bottom - BAR.top"
      />

      <!-- Die perfekte Stelle -->
      <line
        class="mark"
        :x1="barX(PERFECT)"
        :x2="barX(PERFECT)"
        :y1="BAR.top - 1"
        :y2="BAR.bottom + 1"
      />

      <!-- Zeiger -->
      <g class="needle" :class="{ foul }" :transform="`translate(${barX(pos)} ${BAR.top})`">
        <polygon points="-2.4,-6.6 2.4,-6.6 0,-1.4" />
        <line x1="0" y1="-1" x2="0" y2="7" />
      </g>

      <!-- Temperaturanzeige -->
      <text class="readout" x="42" y="34.6">{{ tempAt(pos) }} °C</text>

      <!-- Knopf -->
      <g
        class="button"
        :class="{ pressed: status === 'running' }"
        role="button"
        tabindex="-1"
        @pointerdown.prevent="press"
      >
        <circle :cx="BUTTON.x" :cy="BUTTON.y" :r="BUTTON.r" />
        <circle class="lamp" :cx="BUTTON.x" :cy="BUTTON.y" :r="BUTTON.r - 2.6" />
        <text :x="BUTTON.x" :y="BUTTON.y + BUTTON.r + 5.4">
          {{ status === 'running' ? 'Stopp' : 'Start' }}
        </text>
      </g>

      <!-- Griff und Tuer -->
      <rect class="handle" x="15" y="40.5" width="70" height="3.6" rx="1.8" />
      <rect class="door" x="12" y="46" width="76" height="42" rx="3" />
      <rect class="window" x="19" y="51" width="62" height="32" rx="2" />
      <rect
        class="window-glow"
        x="19"
        y="51"
        width="62"
        height="32"
        rx="2"
        :style="{ opacity: glow }"
      />

      <!-- Hinter der Scheibe: erst die Form mit dem Brät, später die Teigrolle -->
      <g v-if="content === 'raw'" class="loaf">
        <rect class="form" x="34" y="61" width="32" height="13" rx="2" />
        <rect class="paste" x="36" y="63" width="28" height="9" rx="1.5" />
      </g>
      <g v-else class="loaf">
        <rect class="tray" x="30" y="70" width="40" height="3" rx="1.5" />
        <rect class="wrapped" x="31" y="61" width="38" height="12" rx="6" />
        <rect class="seam" x="37" y="64.4" width="26" height="1.4" rx="0.7" />
      </g>
    </svg>

    <p class="counter">
      {{ hits }} / {{ goal }}
      <span v-if="misses">· {{ misses }} daneben</span>
    </p>
  </div>
</template>

<style scoped>
.board {
  position: absolute;
  inset: 0;
}

.surface {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  touch-action: manipulation;
}

.surface.locked {
  pointer-events: none;
}

.body {
  fill: #4a4a4a;
  stroke: #6b6b6b;
  stroke-width: 1;
}

.panel {
  fill: #333;
  stroke: #5c5c5c;
  stroke-width: 0.6;
}

.display {
  fill: #0e1210;
  stroke: #1f2a24;
  stroke-width: 0.8;
}

.zone {
  opacity: 0.85;
}

.zone.red {
  fill: #a8433f;
}

.zone.yellow {
  fill: #d9a441;
}

.zone.green {
  fill: #4c9a55;
}

.bar-frame {
  fill: none;
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 0.5;
}

.mark {
  stroke: #fff;
  stroke-width: 0.7;
  stroke-dasharray: 1.2 1;
}

.needle polygon {
  fill: #fff;
}

.needle line {
  stroke: #fff;
  stroke-width: 0.9;
}

.needle.foul polygon {
  fill: #e0655f;
}

.needle.foul line {
  stroke: #e0655f;
}

.readout {
  fill: #7fd6a0;
  font-family: var(--font-header);
  font-size: 3.4px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-anchor: middle;
}

.button {
  cursor: pointer;
}

.button circle {
  fill: #2a2a2a;
  stroke: #7a7a7a;
  stroke-width: 0.8;
}

.button .lamp {
  fill: #6a6a6a;
  stroke: none;
  transition: fill 0.15s ease;
}

.button:hover .lamp {
  fill: #8f8f8f;
}

.button.pressed .lamp {
  fill: #e0655f;
}

.button text {
  fill: var(--text-muted);
  font-family: var(--font-header);
  font-size: 3.4px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-anchor: middle;
  text-transform: uppercase;
}

.handle {
  fill: #8f8f8f;
  stroke: #b0b0b0;
  stroke-width: 0.5;
}

.door {
  fill: #3f3f3f;
  stroke: #6b6b6b;
  stroke-width: 0.8;
}

.window {
  fill: #14100c;
  stroke: #5c5c5c;
  stroke-width: 0.8;
}

/* Legt sich als warmer Schein ueber die Scheibe, je heisser desto kraeftiger. */
.window-glow {
  fill: #ff8a2b;
  pointer-events: none;
  transition: opacity 0.12s linear;
}

.loaf .form {
  fill: #9a9a9a;
}

.loaf .paste {
  fill: #d09a90;
}

.loaf .tray {
  fill: #8f8f8f;
}

.loaf .wrapped {
  fill: #d8b878;
  stroke: #b8964f;
  stroke-width: 0.6;
}

.loaf .seam {
  fill: rgba(0, 0, 0, 0.2);
}

.counter {
  position: absolute;
  bottom: 4%;
  left: 50%;
  z-index: 3;
  transform: translateX(-50%);
  font-family: var(--font-header);
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--brand-green);
  white-space: nowrap;
  pointer-events: none;
}

.counter span {
  font-size: 0.75rem;
  color: var(--text-faint);
}
</style>
