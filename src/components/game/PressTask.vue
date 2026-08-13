<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import type { Vec } from '../../game/shapes'
import {
  CENTER,
  R_BALL,
  R_FLAT,
  START_RADIUS,
  PUSH_DISTANCE,
  distance,
  angleOf,
  sectorAt,
  sectorAngle,
  pointAt,
  outlineD,
} from '../../game/press'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Arbeitsfläche, Teig und Hand sind hier als SVG
// gezeichnet. Die Trefferzonen stehen in game/press.ts, nicht in der Zeichnung.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400

const surface = ref<SVGSVGElement | null>(null)
/** Ein Eintrag je Sektor: schon flachgedrückt oder noch Kugel */
const flat = ref<boolean[]>(Array.from({ length: props.goal }, () => false))
const drag = ref<{ from: Vec; to: Vec } | null>(null)
const attempts = ref(0)
const note = ref('')
const foul = ref(false)

let foulTimer: ReturnType<typeof setTimeout> | undefined

const flatCount = computed(() => flat.value.filter(Boolean).length)
const accuracy = computed(() =>
  attempts.value === 0 ? 1 : flatCount.value / attempts.value,
)

const radii = computed(() => flat.value.map((done) => (done ? R_FLAT : R_BALL)))
// Der Ballen obendrauf: wo gedrückt wurde, zieht er sich zurück.
const humpRadii = computed(() =>
  flat.value.map((done) => (done ? R_FLAT * 0.34 : R_BALL * 0.8)),
)
const doughD = computed(() => outlineD(radii.value))
const humpD = computed(() => outlineD(humpRadii.value))

/** Pfeile in den Sektoren, die noch Kugel sind */
const guides = computed(() =>
  flat.value
    .map((done, i) => {
      if (done) return null
      const angle = sectorAngle(i, flat.value.length)
      return {
        i,
        from: pointAt(angle, R_BALL * 0.45),
        to: pointAt(angle, R_BALL + 6),
      }
    })
    .filter((guide) => guide !== null),
)

const handAngle = computed(() => {
  const d = drag.value
  if (!d) return 0
  return (angleOf(d.to) * 180) / Math.PI
})

const hint = computed(() => note.value || 'Von der Mitte nach außen drücken')

const state = (): TaskState => ({ done: flatCount.value, accuracy: accuracy.value })

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

const start = (event: PointerEvent) => {
  if (!props.active) return
  const p = toViewBox(event)
  // Gedrückt wird von innen nach außen — anfangen muss man also in der Mitte.
  if (!p || distance(p, CENTER) > START_RADIUS) return
  note.value = ''
  drag.value = { from: p, to: p }
  surface.value?.setPointerCapture(event.pointerId)
}

const move = (event: PointerEvent) => {
  const d = drag.value
  if (!d) return
  const p = toViewBox(event)
  if (!p) return
  d.to = p

  // Weit genug nach außen: der Teig gibt in diesem Sektor nach. Der Rest der
  // Bewegung zählt nicht mehr, für den nächsten Sektor geht es wieder in der
  // Mitte los — ein Durchzug flacht nicht den halben Teig ab.
  if (distance(p, CENTER) < PUSH_DISTANCE) return

  drag.value = null
  attempts.value++
  const index = sectorAt(angleOf(p), flat.value.length)

  if (flat.value[index]) {
    flagFoul('Hier ist er schon flach')
  } else {
    flat.value[index] = true
    note.value = ''
  }

  emit('update', state())
  if (flatCount.value >= props.goal) emit('complete', state())
}

const end = (event: PointerEvent) => {
  const d = drag.value
  drag.value = null
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
  if (!d) return

  // Zu früh losgelassen: der Teig federt zurück.
  attempts.value++
  flagFoul('Weiter nach außen drücken')
  emit('update', state())
}
</script>

<template>
  <div class="board">
    <TaskHint lead="Teig flach drücken" :label="hint" :foul="foul" />

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
          id="press-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.5)" />
        </marker>
      </defs>

      <!-- Bemehlte Arbeitsfläche -->
      <rect class="worktop" x="8" y="14" width="84" height="80" rx="4" />

      <!-- Der Teig: Umriss und Ballen obendrauf -->
      <path class="dough" :d="doughD" />
      <path class="hump" :d="humpD" />

      <!-- Wo noch gedrückt werden muss -->
      <g class="guides">
        <line
          v-for="guide in guides"
          :key="guide.i"
          :x1="guide.from.x"
          :y1="guide.from.y"
          :x2="guide.to.x"
          :y2="guide.to.y"
          marker-end="url(#press-arrow)"
        />
      </g>

      <!-- Ansatzpunkt in der Mitte -->
      <circle class="start-zone" :cx="CENTER.x" :cy="CENTER.y" :r="START_RADIUS" />

      <!-- Laufender Druck: Strecke und Handballen -->
      <template v-if="drag">
        <line
          class="track"
          :x1="drag.from.x"
          :y1="drag.from.y"
          :x2="drag.to.x"
          :y2="drag.to.y"
        />
        <g class="hand" :transform="`translate(${drag.to.x} ${drag.to.y}) rotate(${handAngle})`">
          <ellipse rx="7.5" ry="5.5" />
          <circle cx="6.4" cy="-3" r="1.7" />
          <circle cx="7.6" cy="0.2" r="1.8" />
          <circle cx="6.2" cy="3.4" r="1.7" />
        </g>
      </template>
    </svg>

    <p class="counter">{{ flatCount }} / {{ goal }}</p>
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

.worktop {
  fill: #2b2622;
  stroke: #3d372f;
  stroke-width: 1;
}

/* d ist in modernen Browsern animierbar; wo nicht, springt der Rand eben. */
.dough {
  fill: #e3cfa6;
  stroke: #c9b184;
  stroke-width: 0.8;
  transition: d 0.25s ease;
}

.hump {
  fill: #f0e0bd;
  stroke: none;
  opacity: 0.9;
  transition: d 0.25s ease;
}

.guides line {
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-dasharray: 3 2;
  animation: push 0.9s linear infinite;
}

/* Striche laufen nach außen — in die Richtung, in die gedrückt wird. */
@keyframes push {
  to {
    stroke-dashoffset: -5;
  }
}

.start-zone {
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 0.7;
  stroke-dasharray: 2 2;
  pointer-events: none;
}

.track {
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 2 2;
  pointer-events: none;
}

.hand {
  pointer-events: none;
}

.hand ellipse {
  fill: rgba(255, 255, 255, 0.22);
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 0.8;
}

.hand circle {
  fill: rgba(255, 255, 255, 0.3);
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 0.6;
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
  .guides line {
    animation: none;
  }

  .dough,
  .hump {
    transition: none;
  }
}
</style>
