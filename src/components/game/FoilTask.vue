<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import { distanceToSegment, toPathD, type Vec } from '../../game/shapes'
import {
  CYLINDER,
  FLAPS,
  FOIL_TOP,
  FOIL_BOTTOM,
  PRESS_POINTS,
  isOnFoil,
  PRESS_RADIUS,
  PULL_DISTANCE,
  PULL_LIMIT,
  CUT_LINE,
  CUT_POINTS,
  CUT_HIT,
  CUT_TOLERANCE,
  TUBE,
} from '../../game/foil'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Zylinder, Folie und Schnittlinie sind hier als SVG
// gezeichnet und werden später durch Sprites ersetzt. Die Trefferzonen stehen
// in game/foil.ts, nicht in der Zeichnung.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400

type Phase = 'press' | 'pull' | 'cut' | 'fertig'

const surface = ref<SVGSVGElement | null>(null)
const phase = ref<Phase>('press')
const pressed = ref<boolean[]>(PRESS_POINTS.map(() => false))
const cylinderShift = ref(0)
const cutIndex = ref(0)
const trail = ref<Vec[]>([])
const pointerDown = ref(false)
const pullStart = ref<number | null>(null)
const foul = ref(false)
const samples = ref({ good: 0, total: 0 })

let foulTimer: ReturnType<typeof setTimeout> | undefined

const sideDone = (side: 'left' | 'right') =>
  PRESS_POINTS.every((point, i) => point.side !== side || pressed.value[i])

const leftDone = computed(() => sideDone('left'))
const rightDone = computed(() => sideDone('right'))
const wrapped = computed(() => leftDone.value && rightDone.value)

const done = computed(() => (phase.value === 'cut' ? 1 : phase.value === 'fertig' ? 2 : 0))
const accuracy = computed(() =>
  samples.value.total === 0 ? 1 : samples.value.good / samples.value.total,
)

const cutPathD = toPathD(CUT_LINE)
const trailD = computed(() => (trail.value.length > 1 ? toPathD(trail.value) : ''))

const hint = computed(() => {
  if (phase.value === 'press') {
    const offen = [!leftDone.value && 'links', !rightDone.value && 'rechts'].filter(Boolean)
    return { lead: 'Aktion 1 von 2', label: `Alufolie andrücken (${offen.join(' und ')})` }
  }
  if (phase.value === 'pull') return { lead: 'Aktion 1 von 2', label: 'Zylinder nach oben herausziehen' }
  return { lead: 'Aktion 2 von 2', label: 'Hochkant durchschneiden' }
})

const state = (): TaskState => ({ done: done.value, accuracy: accuracy.value })

const flagFoul = () => {
  foul.value = true
  if (foulTimer) clearTimeout(foulTimer)
  foulTimer = setTimeout(() => (foul.value = false), FOUL_MS)
}

onUnmounted(() => {
  if (foulTimer) clearTimeout(foulTimer)
})

const toViewBox = (event: PointerEvent): Vec | null => {
  const ctm = surface.value?.getScreenCTM()
  if (!ctm) return null
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse())
  return { x: point.x, y: point.y }
}

const insideCylinder = (p: Vec) =>
  p.x >= CYLINDER.left &&
  p.x <= CYLINDER.right &&
  p.y >= CYLINDER.top + cylinderShift.value &&
  p.y <= CYLINDER.bottom + cylinderShift.value

/** Liefert true, sobald der Schritt fertig ist. */
const handleSample = (p: Vec, previous: Vec): boolean => {
  if (phase.value === 'press') {
    samples.value.total++
    if (isOnFoil(p)) samples.value.good++

    PRESS_POINTS.forEach((point, i) => {
      if (!pressed.value[i] && distanceToSegment(point, previous, p) <= PRESS_RADIUS) {
        pressed.value[i] = true
      }
    })

    if (wrapped.value) phase.value = 'pull'
    emit('update', state())
    return false
  }

  if (phase.value === 'pull') {
    if (pullStart.value === null) return false
    // Nur nach oben, und nicht weiter als nötig aus dem Bild heraus.
    cylinderShift.value = Math.max(-PULL_LIMIT, Math.min(0, p.y - pullStart.value))
    return false
  }

  if (phase.value === 'cut') {
    samples.value.total++
    if (distanceToSegment(p, CUT_LINE[0]!, CUT_LINE[1]!) <= CUT_TOLERANCE) samples.value.good++

    trail.value.push(p)
    while (
      cutIndex.value < CUT_POINTS.length &&
      distanceToSegment(CUT_POINTS[cutIndex.value]!, previous, p) <= CUT_HIT
    ) {
      cutIndex.value++
    }

    if (cutIndex.value >= CUT_POINTS.length) {
      phase.value = 'fertig'
      pointerDown.value = false
      emit('update', state())
      emit('complete', state())
      return true
    }
    emit('update', state())
  }

  return false
}

const start = (event: PointerEvent) => {
  if (!props.active) return
  const p = toViewBox(event)
  if (!p) return

  pointerDown.value = true
  surface.value?.setPointerCapture(event.pointerId)

  if (phase.value === 'pull') {
    // Nur von innen greifen, sonst zählt es als Fehlgriff.
    if (insideCylinder(p)) {
      pullStart.value = p.y
    } else {
      pullStart.value = null
      samples.value.total += 10
      flagFoul()
      emit('update', state())
    }
    return
  }

  // Ein einzelnes Antippen soll die Folie auch andrücken, nicht nur ein Zug.
  if (phase.value === 'press') {
    trail.value = [p]
    handleSample(p, p)
    return
  }

  if (phase.value === 'cut') {
    cutIndex.value = 0
    trail.value = []
  }
}

const move = (event: PointerEvent) => {
  if (!pointerDown.value || phase.value === 'fertig') return
  const coalesced = event.getCoalescedEvents?.() ?? []
  for (const sample of coalesced.length > 0 ? coalesced : [event]) {
    const p = toViewBox(sample)
    if (!p) continue
    const previous = trail.value[trail.value.length - 1] ?? p
    if (phase.value !== 'cut') trail.value = [p]
    if (handleSample(p, previous)) return
  }
}

const end = (event: PointerEvent) => {
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
  pointerDown.value = false

  if (phase.value === 'pull') {
    if (pullStart.value !== null) {
      samples.value.total += 10
      if (cylinderShift.value <= -PULL_DISTANCE) {
        samples.value.good += 10
        phase.value = 'cut'
      } else {
        // Zu kurz gezogen: der Zylinder rutscht zurück.
        cylinderShift.value = 0
        flagFoul()
      }
      pullStart.value = null
      emit('update', state())
    }
    trail.value = []
    return
  }

  // Losgelassen, bevor der Schnitt durch war: der Schnitt beginnt neu.
  if (phase.value === 'cut') {
    cutIndex.value = 0
  }
  trail.value = []
}
</script>

<template>
  <div class="board">
    <TaskHint :lead="hint.lead" :label="hint.label" :foul="foul" />

    <svg
      ref="surface"
      class="surface"
      :class="{ locked: !active }"
      viewBox="0 0 100 100"
      @pointerdown.prevent="start"
      @pointermove="move"
      @pointerup="end"
      @pointercancel="end"
    >
      <!-- Folienbahnen links und rechts, klappen an den Zylinder, wenn die
           Seite fertig angedrückt ist -->
      <template v-if="phase === 'press' || phase === 'pull'">
        <g class="flap left" :class="{ folded: leftDone }">
          <rect
            :x="FLAPS.left.left"
            :y="FOIL_TOP"
            :width="FLAPS.left.right - FLAPS.left.left"
            :height="FOIL_BOTTOM - FOIL_TOP"
          />
        </g>
        <g class="flap right" :class="{ folded: rightDone }">
          <rect
            :x="FLAPS.right.left"
            :y="FOIL_TOP"
            :width="FLAPS.right.right - FLAPS.right.left"
            :height="FOIL_BOTTOM - FOIL_TOP"
          />
        </g>
      </template>

      <!-- Zusammengedrückte Rolle, sobald der Zylinder heraus ist -->
      <template v-else>
        <rect
          class="tube half-left"
          :class="{ split: phase === 'fertig' }"
          :x="TUBE.left"
          :y="FOIL_TOP"
          :width="50 - TUBE.left"
          :height="FOIL_BOTTOM - FOIL_TOP"
        />
        <rect
          class="tube half-right"
          :class="{ split: phase === 'fertig' }"
          :x="50"
          :y="FOIL_TOP"
          :width="TUBE.right - 50"
          :height="FOIL_BOTTOM - FOIL_TOP"
        />
      </template>

      <!-- Zylinder, solange er noch drin ist -->
      <g
        v-if="phase === 'press' || phase === 'pull'"
        class="cylinder"
        :transform="`translate(0 ${cylinderShift})`"
      >
        <rect
          :x="CYLINDER.left"
          :y="CYLINDER.top"
          :width="CYLINDER.right - CYLINDER.left"
          :height="CYLINDER.bottom - CYLINDER.top"
          rx="2"
        />
        <ellipse :cx="(CYLINDER.left + CYLINDER.right) / 2" :cy="CYLINDER.top" rx="10" ry="3.5" />
      </g>

      <!-- Andrückstellen -->
      <template v-if="phase === 'press'">
        <circle
          v-for="(point, i) in PRESS_POINTS"
          :key="i"
          :cx="point.x"
          :cy="point.y"
          :r="pressed[i] ? 4.5 : 4"
          class="patch"
          :class="{ done: pressed[i] }"
        />
      </template>

      <!-- Griffpfeil beim Herausziehen -->
      <g v-if="phase === 'pull'" class="pull-hint" :transform="`translate(0 ${cylinderShift})`">
        <path d="M50 16 L50 5 M45 10 L50 5 L55 10" />
      </g>

      <!-- Schnittlinie, hochkant -->
      <template v-if="phase === 'cut'">
        <path :d="cutPathD" class="cut-line" />
        <circle
          v-for="(point, i) in CUT_POINTS"
          :key="i"
          :cx="point.x"
          :cy="point.y"
          :r="i < cutIndex ? 2.4 : 1.8"
          class="cut-point"
          :class="{ hit: i < cutIndex, next: i === cutIndex }"
        />
        <path v-if="trailD" :d="trailD" class="trail" />
      </template>
    </svg>

    <p class="counter">{{ done }} / {{ goal }}</p>
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
  touch-action: none;
  cursor: crosshair;
}

.surface.locked {
  pointer-events: none;
}

/* --- Folie --- */
.flap rect {
  fill: #454545;
  stroke: #6e6e6e;
  stroke-width: 1;
  stroke-dasharray: 3 2;
  transition: fill 0.3s ease, stroke 0.3s ease;
}

.flap {
  transform-box: view-box;
  transition: transform 0.35s ease;
}

.flap.left {
  transform-origin: 40px 50px;
}

.flap.right {
  transform-origin: 60px 50px;
}

/* Angedrückt: die Bahn legt sich an den Zylinder */
.flap.folded {
  transform: scaleX(0.22);
}

.flap.folded rect {
  fill: #9a9a9a;
  stroke: #c4c4c4;
  stroke-dasharray: none;
}

.tube {
  fill: #9a9a9a;
  stroke: #c4c4c4;
  stroke-width: 1;
  transition: transform 0.4s ease;
  transform-box: view-box;
}

/* Nach dem Schnitt fallen die Hälften auseinander. */
.half-left.split {
  transform: translateX(-6px);
}

.half-right.split {
  transform: translateX(6px);
}

.cylinder rect,
.cylinder ellipse {
  fill: #2b2b2b;
  stroke: #4a4a4a;
  stroke-width: 1;
}

.patch {
  fill: rgba(255, 255, 255, 0.12);
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 0.8;
  transition: fill 0.15s ease;
}

.patch.done {
  fill: var(--brand-green);
  stroke: none;
}

/* --- Schnitt --- */
.cut-line {
  fill: none;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 1.4;
  stroke-dasharray: 3 2;
  animation: march 0.8s linear infinite;
}

.cut-point {
  fill: rgba(255, 255, 255, 0.35);
}

.cut-point.next {
  fill: #fff;
}

.cut-point.hit {
  fill: var(--brand-green);
}

.trail {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 2.2;
  stroke-linecap: round;
}

.pull-hint path {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: nudge 1s ease-in-out infinite;
}

@keyframes march {
  to {
    stroke-dashoffset: -5;
  }
}

@keyframes nudge {
  50% {
    transform: translateY(-3px);
  }
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
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .cut-line,
  .pull-hint path {
    animation: none;
  }
}
</style>
