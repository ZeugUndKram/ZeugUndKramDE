<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import type { Vec } from '../../game/shapes'
import { BOWL, FORM, SPOTS, SPOT_RADIUS, isInBowl, nearestFreeSpot } from '../../game/fill'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Form, Schüssel und Löffelklecks sind hier als SVG
// gezeichnet. Die Trefferzonen stehen in game/fill.ts, nicht in der Zeichnung.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400
const PASTE = '#d09a90'

const surface = ref<SVGSVGElement | null>(null)
const filled = ref<boolean[]>(SPOTS.map(() => false))
const scoop = ref<Vec | null>(null)
const attempts = ref(0)
const foul = ref(false)

let foulTimer: ReturnType<typeof setTimeout> | undefined

const filledCount = computed(() => filled.value.filter(Boolean).length)
const accuracy = computed(() =>
  attempts.value === 0 ? 1 : filledCount.value / attempts.value,
)

const hint = computed(() =>
  scoop.value ? 'In eine freie Stelle setzen' : 'Brät aus der Schüssel holen',
)

const state = (): TaskState => ({ done: filledCount.value, accuracy: accuracy.value })

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

const start = (event: PointerEvent) => {
  if (!props.active) return
  const p = toViewBox(event)
  // Brät gibt es nur aus der Schüssel.
  if (!p || !isInBowl(p)) return
  scoop.value = p
  surface.value?.setPointerCapture(event.pointerId)
}

const move = (event: PointerEvent) => {
  if (!scoop.value) return
  const p = toViewBox(event)
  if (p) scoop.value = p
}

const end = (event: PointerEvent) => {
  const p = scoop.value
  scoop.value = null
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
  if (!p) return

  attempts.value++
  const target = nearestFreeSpot(p, filled.value)

  if (target >= 0) {
    filled.value[target] = true
  } else {
    // Danebengesetzt: der Klecks ist weg und es kostet Genauigkeit.
    flagFoul()
  }

  emit('update', state())
  if (filledCount.value >= props.goal) emit('complete', state())
}
</script>

<template>
  <div class="board">
    <TaskHint lead="Form füllen" :label="hint" :foul="foul" />

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
      <!-- Alufolienform -->
      <g class="form">
        <rect
          :x="FORM.left"
          :y="FORM.top"
          :width="FORM.right - FORM.left"
          :height="FORM.bottom - FORM.top"
          rx="3"
        />
        <rect
          class="form-inner"
          :x="FORM.left + 3"
          :y="FORM.top + 3"
          :width="FORM.right - FORM.left - 6"
          :height="FORM.bottom - FORM.top - 6"
          rx="2"
        />
      </g>

      <!-- Die fünf Stellen -->
      <g
        v-for="(spot, i) in SPOTS"
        :key="i"
        class="spot"
        :class="{ done: filled[i] }"
      >
        <ellipse :cx="spot.x" :cy="spot.y" :rx="SPOT_RADIUS" :ry="SPOT_RADIUS * 0.8" />
      </g>

      <!-- Schüssel mit Brät -->
      <g class="bowl">
        <circle :cx="BOWL.x" :cy="BOWL.y" :r="BOWL.r" />
        <circle class="paste" :cx="BOWL.x" :cy="BOWL.y" :r="BOWL.r - 3.5" :fill="PASTE" />
        <text :x="BOWL.x" :y="BOWL.y + BOWL.r + 7">Brät</text>
      </g>

      <!-- Klecks am Zeiger -->
      <ellipse
        v-if="scoop"
        class="scoop"
        :cx="scoop.x"
        :cy="scoop.y"
        :rx="SPOT_RADIUS"
        :ry="SPOT_RADIUS * 0.8"
        :fill="PASTE"
      />
    </svg>

    <p class="counter">{{ filledCount }} / {{ goal }}</p>
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

.form rect {
  fill: #9a9a9a;
  stroke: #c4c4c4;
  stroke-width: 1;
}

.form .form-inner {
  fill: #6f6f6f;
  stroke: none;
}

.spot ellipse {
  fill: rgba(0, 0, 0, 0.28);
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 0.8;
  stroke-dasharray: 2 1.5;
  transition: fill 0.2s ease;
}

.spot.done ellipse {
  fill: #d09a90;
  stroke: #e6b8ae;
  stroke-dasharray: none;
}

.bowl circle {
  fill: #3a3a3a;
  stroke: #565656;
  stroke-width: 1;
}

.bowl .paste {
  stroke: #b87f75;
  stroke-width: 0.8;
}

.bowl text {
  fill: var(--text-muted);
  font-family: var(--font-header);
  font-size: 5px;
  font-weight: 700;
  text-anchor: middle;
}

.scoop {
  stroke: #b87f75;
  stroke-width: 0.8;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
  pointer-events: none;
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
</style>
