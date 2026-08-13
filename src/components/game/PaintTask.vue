<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import { toPathD, type Vec } from '../../game/shapes'
import {
  LOAF,
  BOWL,
  BRUSH_RADIUS,
  BRUSH_RANGE,
  buildCells,
  stripeX,
  isInBowl,
  isOnLoaf,
  cellsAlong,
} from '../../game/paint'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Zylinder, Schüssel und Pinsel sind hier als SVG
// gezeichnet. Die Zellen, die als bestrichen zählen, stehen in game/paint.ts.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400

const cells = buildCells(props.goal)

const surface = ref<SVGSVGElement | null>(null)
const covered = ref<boolean[]>(cells.map(() => false))
/** Gemalte Striche als Polylinien — nur zum Anzeigen */
const strokes = ref<Vec[][]>([])
/** Senf im Pinsel, 0..1 */
const load = ref(0)
const samples = ref({ good: 0, total: 0 })
const brush = ref<Vec | null>(null)
const note = ref('')
const foul = ref(false)

let painting = false
let last: Vec | null = null
let openStroke = -1
let foulTimer: ReturnType<typeof setTimeout> | undefined

const doneStripes = computed(() => {
  const full = new Array(props.goal).fill(true)
  cells.forEach((cell, i) => {
    if (!covered.value[i]) full[cell.stripe] = false
  })
  return full
})

const doneCount = computed(() => doneStripes.value.filter(Boolean).length)
const accuracy = computed(() =>
  samples.value.total === 0 ? 1 : samples.value.good / samples.value.total,
)

const hint = computed(() => {
  if (note.value) return note.value
  if (load.value <= 0) return 'Pinsel in den Senf tunken'
  return 'Zylinder bestreichen'
})

const state = (): TaskState => ({ done: doneCount.value, accuracy: accuracy.value })

// Ein einzelner Tupfer braucht trotzdem zwei Punkte, sonst zeichnet SVG nichts.
const strokeD = (points: Vec[]): string =>
  points.length === 1
    ? `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)} L ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`
    : toPathD(points)

const flagFoul = (why: string) => {
  note.value = why
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

const addPoint = (p: Vec) => {
  if (openStroke < 0) {
    strokes.value.push([p])
    openStroke = strokes.value.length - 1
    return
  }
  strokes.value[openStroke]!.push(p)
}

const endStroke = () => {
  openStroke = -1
}

const dip = () => {
  load.value = 1
  note.value = ''
  endStroke()
}

const start = (event: PointerEvent) => {
  if (!props.active) return
  const p = toViewBox(event)
  if (!p) return

  painting = true
  last = p
  surface.value?.setPointerCapture(event.pointerId)

  if (isInBowl(p)) {
    dip()
    return
  }
  if (load.value <= 0) {
    flagFoul('Pinsel ist leer')
    return
  }
  paintTo(p)
}

const move = (event: PointerEvent) => {
  if (!painting) return
  const p = toViewBox(event)
  if (!p) return
  paintTo(p)
}

const paintTo = (p: Vec) => {
  brush.value = p
  const from = last ?? p
  last = p

  // In der Schüssel wird nur nachgetankt, nichts verbraucht und nichts gemalt.
  if (isInBowl(p)) {
    dip()
    return
  }

  if (load.value <= 0) {
    if (!note.value) flagFoul('Pinsel leer — neuen Senf holen')
    return
  }

  // Verbrauch nach zurückgelegtem Weg: der Pinsel gibt beim Streichen ab.
  load.value = Math.max(0, load.value - Math.hypot(p.x - from.x, p.y - from.y) / BRUSH_RANGE)

  const hits = cellsAlong(cells, from, p)
  samples.value.total++
  // Sauber ist, was auf dem Zylinder landet. Der Rest ist Senf auf dem Brett.
  if (hits.length > 0 || isOnLoaf(p)) samples.value.good++
  hits.forEach((i) => (covered.value[i] = true))

  addPoint(p)
  if (load.value <= 0) {
    endStroke()
    flagFoul('Pinsel leer — neuen Senf holen')
  }

  emit('update', state())
  if (doneCount.value >= props.goal) emit('complete', state())
}

const end = (event: PointerEvent) => {
  painting = false
  last = null
  brush.value = null
  endStroke()
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <div class="board">
    <TaskHint lead="Süßen Senf aufstreichen" :label="hint" :foul="foul" />

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
      <defs>
        <!-- Senf bleibt auf dem Zylinder; was daneben geht, sieht man nicht. -->
        <clipPath id="paint-loaf">
          <rect
            :x="LOAF.left"
            :y="LOAF.top"
            :width="LOAF.right - LOAF.left"
            :height="LOAF.bottom - LOAF.top"
            :rx="LOAF.rx"
          />
        </clipPath>
      </defs>

      <!-- Der Zylinder -->
      <g class="loaf">
        <rect
          :x="LOAF.left"
          :y="LOAF.top"
          :width="LOAF.right - LOAF.left"
          :height="LOAF.bottom - LOAF.top"
          :rx="LOAF.rx"
        />
        <rect
          class="sheen"
          :x="LOAF.left + 4"
          :y="LOAF.top + 4"
          :width="LOAF.right - LOAF.left - 8"
          :height="6"
          rx="3"
        />
      </g>

      <!-- Aufgetragener Senf -->
      <g clip-path="url(#paint-loaf)">
        <path
          v-for="(stroke, i) in strokes"
          :key="i"
          class="mustard"
          :d="strokeD(stroke)"
          :stroke-width="BRUSH_RADIUS * 2"
        />
      </g>

      <!-- Bahnen: Trennlinien und fertige Abschnitte -->
      <g class="stripes">
        <line
          v-for="i in goal - 1"
          :key="i"
          :x1="stripeX(i, goal)"
          :x2="stripeX(i, goal)"
          :y1="LOAF.top"
          :y2="LOAF.bottom"
        />
        <rect
          v-for="(done, i) in doneStripes"
          v-show="done"
          :key="`done-${i}`"
          class="done"
          :x="stripeX(i, goal)"
          :y="LOAF.top"
          :width="(LOAF.right - LOAF.left) / goal"
          :height="LOAF.bottom - LOAF.top"
        />
      </g>

      <!-- Schüssel mit süßem Senf -->
      <g class="bowl">
        <circle :cx="BOWL.x" :cy="BOWL.y" :r="BOWL.r" />
        <circle class="mustard-pot" :cx="BOWL.x" :cy="BOWL.y" :r="BOWL.r - 3" />
        <text :x="BOWL.x" :y="BOWL.y + 1.5">Senf</text>
      </g>

      <!-- Füllstand des Pinsels -->
      <g class="gauge">
        <text x="52" y="72">Pinsel</text>
        <rect class="gauge-frame" x="52" y="74.5" width="34" height="6" rx="3" />
        <rect
          class="gauge-fill"
          x="53"
          y="75.5"
          :width="Math.max(0, load * 32)"
          height="4"
          rx="2"
        />
      </g>

      <!-- Pinsel am Zeiger -->
      <g v-if="brush" class="brush" :class="{ empty: load <= 0 }">
        <circle :cx="brush.x" :cy="brush.y" :r="BRUSH_RADIUS" />
        <line :x1="brush.x" :y1="brush.y" :x2="brush.x + 9" :y2="brush.y - 11" />
      </g>
    </svg>

    <p class="counter">{{ doneCount }} / {{ goal }}</p>
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
  cursor: grab;
}

.surface.locked {
  pointer-events: none;
}

.loaf rect {
  fill: #d09a90;
  stroke: #b87f75;
  stroke-width: 1;
}

.loaf .sheen {
  fill: rgba(255, 255, 255, 0.14);
  stroke: none;
}

.mustard {
  fill: none;
  stroke: #cf9b3b;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stripes line {
  stroke: rgba(0, 0, 0, 0.25);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

.stripes .done {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 1;
}

.bowl circle {
  fill: #3a3a3a;
  stroke: #565656;
  stroke-width: 1;
}

.bowl .mustard-pot {
  fill: #cf9b3b;
  stroke: #a97c2c;
  stroke-width: 0.8;
}

.bowl text {
  fill: #3a2c10;
  font-family: var(--font-header);
  font-size: 5px;
  font-weight: 700;
  text-anchor: middle;
}

.gauge text {
  fill: var(--text-faint);
  font-family: var(--font-header);
  font-size: 3.4px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.gauge-frame {
  fill: #2a2a2a;
  stroke: #565656;
  stroke-width: 0.6;
}

.gauge-fill {
  fill: #cf9b3b;
  transition: width 0.1s linear;
}

.brush {
  pointer-events: none;
}

.brush circle {
  fill: rgba(207, 155, 59, 0.35);
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 0.8;
}

.brush line {
  stroke: rgba(255, 255, 255, 0.7);
  stroke-width: 2;
  stroke-linecap: round;
}

.brush.empty circle {
  fill: rgba(255, 255, 255, 0.08);
  stroke: rgba(224, 101, 95, 0.8);
  stroke-dasharray: 2 1.5;
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
  .gauge-fill {
    transition: none;
  }
}
</style>
