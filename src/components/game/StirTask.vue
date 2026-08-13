<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import GameSprite from './GameSprite.vue'
import TaskHint from './TaskHint.vue'
import {
  pickShapes,
  resample,
  distanceToPath,
  distanceToSegment,
  toPathD,
  type Vec,
} from '../../game/shapes'
import type { TaskState } from '../../game/task'

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

/** Wie viele Punkte der Reihe nach getroffen werden muessen */
const CHECKPOINTS = 8
/** Trefferradius eines Checkpoints, in viewBox-Einheiten */
const HIT_RADIUS = 13
/** Bis hierhin gilt der Strich noch als auf der Linie */
const TOLERANCE = 12

const shapes = pickShapes(props.goal)
const index = ref(0)
const nextPoint = ref(0)
const tracing = ref(false)
const trail = ref<Vec[]>([])
const samples = ref({ good: 0, total: 0 })

const surface = ref<SVGSVGElement | null>(null)
const foul = ref(false)
let foulTimer: ReturnType<typeof setTimeout> | undefined

const FOUL_MS = 400

const flagFoul = () => {
  foul.value = true
  if (foulTimer) clearTimeout(foulTimer)
  foulTimer = setTimeout(() => (foul.value = false), FOUL_MS)
}

onUnmounted(() => {
  if (foulTimer) clearTimeout(foulTimer)
})

const shape = computed(() => shapes[index.value] ?? shapes[shapes.length - 1]!)
const checkpoints = computed(() => resample(shape.value.points, CHECKPOINTS))
const pathD = computed(() => toPathD(shape.value.points))
const trailD = computed(() => (trail.value.length > 1 ? toPathD(trail.value) : ''))
const accuracy = computed(() =>
  samples.value.total === 0 ? 1 : samples.value.good / samples.value.total,
)

const state = (): TaskState => ({ done: index.value, accuracy: accuracy.value })

// Ueber die Screen-CTM rechnen statt ueber das Bounding-Rect: so stimmen die
// Koordinaten auch dann, wenn die viewBox im Element zentriert eingepasst wird.
const toViewBox = (event: PointerEvent): Vec | null => {
  const svg = surface.value
  const ctm = svg?.getScreenCTM()
  if (!ctm) return null
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse())
  return { x: point.x, y: point.y }
}

const resetTrace = () => {
  nextPoint.value = 0
  trail.value = []
}

const start = (event: PointerEvent) => {
  if (!props.active) return
  tracing.value = true
  resetTrace()
  surface.value?.setPointerCapture(event.pointerId)
}

const move = (event: PointerEvent) => {
  if (!tracing.value) return
  // Der Browser fasst mehrere Hardware-Messpunkte zu einem pointermove zusammen.
  // Einzeln ausgewertet haengen Treffer und Genauigkeit nicht an der Bildrate.
  const coalesced = event.getCoalescedEvents?.() ?? []
  for (const sample of coalesced.length > 0 ? coalesced : [event]) {
    handleSample(sample)
    if (!tracing.value) return
  }
}

const handleSample = (event: PointerEvent) => {
  const p = toViewBox(event)
  if (!p) return

  const previous = trail.value[trail.value.length - 1] ?? p
  trail.value.push(p)

  // Genauigkeit: jeder Messpunkt zaehlt, egal ob er die Linie trifft.
  samples.value.total++
  if (distanceToPath(p, shape.value.points) <= TOLERANCE) samples.value.good++

  // Gegen die Strecke seit dem letzten Messpunkt pruefen, nicht gegen den Punkt
  // allein: ein schneller Strich springt sonst ueber Checkpoints hinweg und die
  // Form liesse sich nicht abschliessen. Mehrere auf einmal sind erlaubt.
  const list = checkpoints.value
  while (
    nextPoint.value < list.length &&
    distanceToSegment(list[nextPoint.value]!, previous, p) <= HIT_RADIUS
  ) {
    nextPoint.value++
  }

  // Einen Punkt beruehrt, der noch nicht dran war: die Form faengt von vorne an.
  // Der Schlusspunkt ist ausgenommen — bei geschlossenen Formen liegt er auf dem
  // Startpunkt, man waere beim Losfahren sofort disqualifiziert. Als Abkuerzung
  // taugt er nicht, weil die Punkte davor trotzdem der Reihe nach fallen muessen.
  for (let i = nextPoint.value + 1; i < list.length - 1; i++) {
    if (distanceToSegment(list[i]!, previous, p) <= HIT_RADIUS) {
      flagFoul()
      resetTrace()
      emit('update', state())
      return
    }
  }

  if (nextPoint.value >= list.length) {
    tracing.value = false
    index.value++
    resetTrace()
    emit('update', state())
    if (index.value >= props.goal) emit('complete', state())
    return
  }

  emit('update', state())
}

const end = (event: PointerEvent) => {
  // Erst freigeben, auch wenn die Form schon mittendrin fertig wurde.
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
  if (!tracing.value) return
  tracing.value = false
  // Abgesetzt bevor die Form fertig war: dieselbe Form nochmal.
  resetTrace()
}
</script>

<template>
  <div class="board">
    <div class="bowl-under">
      <GameSprite name="bowl" />
    </div>

    <TaskHint lead="Form nachfahren" :label="shape.label" :foul="foul" />

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
        <marker
          id="stir-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.45)" />
        </marker>
      </defs>

      <!-- Sollform. Die laufenden Striche zeigen die Zeichenrichtung. -->
      <path :d="pathD" class="guide" marker-end="url(#stir-arrow)" />

      <!-- Startpunkt -->
      <circle
        :cx="shape.points[0]!.x"
        :cy="shape.points[0]!.y"
        r="3.2"
        class="start-dot"
      />

      <!-- Checkpoints, die der Reihe nach eingesammelt werden -->
      <circle
        v-for="(point, i) in checkpoints"
        :key="i"
        :cx="point.x"
        :cy="point.y"
        :r="i < nextPoint ? 2.4 : 1.8"
        class="checkpoint"
        :class="{ hit: i < nextPoint, next: i === nextPoint }"
      />

      <!-- Gezogene Linie des Spielers -->
      <path v-if="trailD" :d="trailD" class="trail" :class="{ foul }" />
    </svg>

    <p class="counter">{{ index }} / {{ goal }}</p>
  </div>
</template>

<style scoped>
.board {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bowl-under {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 62%;
  max-width: 420px;
  opacity: 0.4;
  transform: translate(-50%, -46%);
}

/* Fuellt das ganze Brett; die viewBox wird darin quadratisch zentriert
   eingepasst, damit ein Kreis auch als Kreis ankommt. */
.surface {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
}

.surface.locked {
  pointer-events: none;
}

.guide {
  fill: none;
  stroke: rgba(255, 255, 255, 0.22);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 4 3;
  animation: march 0.8s linear infinite;
}

.start-dot {
  fill: none;
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 1.2;
}

/* Laufende Striche in Zeichenrichtung */
@keyframes march {
  to {
    stroke-dashoffset: -7;
  }
}

.checkpoint {
  fill: rgba(255, 255, 255, 0.3);
  transition: fill 0.15s ease;
}

.checkpoint.next {
  fill: #fff;
}

.checkpoint.hit {
  fill: var(--brand-green);
}

.trail {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.85;
}

.trail.foul {
  stroke: #e0655f;
}

.counter {
  position: absolute;
  bottom: 4%;
  z-index: 3;
  pointer-events: none;
  font-family: var(--font-header);
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--brand-green);
}

@media (prefers-reduced-motion: reduce) {
  .guide {
    animation: none;
  }
}
</style>
