<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import type { Vec } from '../../game/shapes'
import {
  DOUGH,
  ROLL,
  buildFlaps,
  flapAt,
  foldFor,
  foldEdge,
  outerEdge,
} from '../../game/wrap'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Teigplatte, Zylinder und Hand sind hier als SVG
// gezeichnet. Die Greifzonen und die Faltentiefe stehen in game/wrap.ts.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400

const flaps = buildFlaps(props.goal)

const surface = ref<SVGSVGElement | null>(null)
/** Je Lappen: wie weit er gerade übergezogen ist, 0..1 */
const folds = ref<number[]>(flaps.map(() => 0))
const done = ref<boolean[]>(flaps.map(() => false))
const held = ref(-1)
const pointer = ref<Vec>({ x: 50, y: 50 })
const attempts = ref(0)
const note = ref('')
const foul = ref(false)

let foulTimer: ReturnType<typeof setTimeout> | undefined

const doneCount = computed(() => done.value.filter(Boolean).length)
const accuracy = computed(() =>
  attempts.value === 0 ? 1 : doneCount.value / attempts.value,
)

const hint = computed(() => note.value || 'Teig von der Seite drüberziehen')

const state = (): TaskState => ({ done: doneCount.value, accuracy: accuracy.value })

/** Der übergezogene Teil eines Lappens als Rechteck über dem Zylinder */
const cover = (index: number) => {
  const flap = flaps[index]!
  const edge = foldEdge(flap, folds.value[index]!)
  return {
    x: flap.left,
    y: flap.side === 'top' ? ROLL.top : edge,
    width: flap.right - flap.left,
    height: flap.side === 'top' ? edge - ROLL.top : ROLL.bottom - edge,
  }
}

/** Der Teil des Fladens, der schon nach innen gezogen wurde — wird ausmaskiert */
const gone = (index: number) => {
  const flap = flaps[index]!
  const edge = outerEdge(flap, folds.value[index]!)
  return {
    x: flap.left,
    y: flap.side === 'top' ? 0 : edge,
    width: flap.right - flap.left,
    height: flap.side === 'top' ? edge : 100 - edge,
  }
}

/** Pfeil, der zeigt, wohin ein noch offener Lappen gehört */
const guide = (index: number) => {
  const flap = flaps[index]!
  const x = (flap.left + flap.right) / 2
  return flap.side === 'top'
    ? { x, y1: ROLL.top - 13, y2: ROLL.top - 3 }
    : { x, y1: ROLL.bottom + 13, y2: ROLL.bottom + 3 }
}

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
  if (!p) return

  const index = flapAt(p, flaps)
  // Daneben gegriffen: kostet nichts, es passiert nur nichts.
  if (index < 0) return

  if (done.value[index]) {
    attempts.value++
    flagFoul('Der liegt schon drüber')
    emit('update', state())
    return
  }

  note.value = ''
  held.value = index
  pointer.value = p
  surface.value?.setPointerCapture(event.pointerId)
}

const move = (event: PointerEvent) => {
  const index = held.value
  if (index < 0) return
  const p = toViewBox(event)
  if (!p) return

  pointer.value = p
  const fold = foldFor(flaps[index]!, p)
  folds.value[index] = fold
  if (fold < 1) return

  // Über die Mitte hinaus gezogen: der Lappen bleibt liegen.
  held.value = -1
  done.value[index] = true
  attempts.value++
  emit('update', state())
  if (doneCount.value >= props.goal) emit('complete', state())
}

const end = (event: PointerEvent) => {
  const index = held.value
  held.value = -1
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }
  if (index < 0) return

  // Zu früh losgelassen: der Teig zieht sich zurück.
  folds.value[index] = 0
  attempts.value++
  flagFoul('Weiter über die Mitte ziehen')
  emit('update', state())
}
</script>

<template>
  <div class="board">
    <TaskHint lead="Teig umwickeln" :label="hint" :foul="foul" />

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
        <!-- Was übergezogen ist, fehlt außen: die Lappen werden weggenommen. -->
        <mask id="wrap-dough" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect x="0" y="0" width="100" height="100" fill="#fff" />
          <rect v-for="(flap, i) in flaps" :key="i" fill="#000" v-bind="gone(i)" />
        </mask>

        <!-- Der übergezogene Teig endet an der Zylinderkante, auch an den runden Enden. -->
        <clipPath id="wrap-roll">
          <rect
            :x="ROLL.left"
            :y="ROLL.top"
            :width="ROLL.right - ROLL.left"
            :height="ROLL.bottom - ROLL.top"
            :rx="(ROLL.bottom - ROLL.top) / 2"
          />
        </clipPath>

        <marker
          id="wrap-arrow"
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

      <!-- Arbeitsfläche -->
      <rect class="worktop" x="6" y="14" width="88" height="72" rx="4" />

      <!-- Der rund ausgerollte Teig, mit den Grenzen der Lappen -->
      <g mask="url(#wrap-dough)">
        <circle class="sheet" :cx="DOUGH.x" :cy="DOUGH.y" :r="DOUGH.r" />
        <g class="seams">
          <line
            v-for="(flap, i) in flaps"
            :key="i"
            :x1="flap.right"
            :x2="flap.right"
            :y1="flap.side === 'top' ? DOUGH.y - DOUGH.r : ROLL.bottom"
            :y2="flap.side === 'top' ? ROLL.top : DOUGH.y + DOUGH.r"
          />
        </g>
      </g>

      <!-- Der Zylinder mit süßem Senf, von oben -->
      <g class="roll">
        <rect
          :x="ROLL.left"
          :y="ROLL.top"
          :width="ROLL.right - ROLL.left"
          :height="ROLL.bottom - ROLL.top"
          :rx="(ROLL.bottom - ROLL.top) / 2"
        />
        <rect
          class="sheen"
          :x="ROLL.left + 6"
          :y="ROLL.top + 3.5"
          :width="ROLL.right - ROLL.left - 12"
          height="3"
          rx="1.5"
        />
      </g>

      <!-- Übergezogene Lappen -->
      <g class="covers" clip-path="url(#wrap-roll)">
        <template v-for="(flap, i) in flaps" :key="i">
          <rect
            v-if="folds[i]! > 0"
            class="cover"
            :class="{ done: done[i] }"
            v-bind="cover(i)"
          />
          <line
            v-if="folds[i]! > 0"
            class="fold-edge"
            :x1="flap.left"
            :x2="flap.right"
            :y1="foldEdge(flap, folds[i]!)"
            :y2="foldEdge(flap, folds[i]!)"
          />
        </template>
      </g>

      <!-- Wo noch gezogen werden muss -->
      <g class="guides">
        <template v-for="(flap, i) in flaps" :key="i">
          <line
            v-if="!done[i] && held !== i"
            :x1="guide(i).x"
            :x2="guide(i).x"
            :y1="guide(i).y1"
            :y2="guide(i).y2"
            :marker-end="`url(#wrap-arrow)`"
          />
        </template>
      </g>

      <!-- Hand am gehaltenen Lappen -->
      <g
        v-if="held >= 0"
        class="hand"
        :transform="`translate(${pointer.x} ${pointer.y}) rotate(${flaps[held]!.side === 'top' ? 90 : -90})`"
      >
        <ellipse rx="8" ry="5.5" />
        <circle cx="6.6" cy="-2.6" r="1.6" />
        <circle cx="7.8" cy="0.6" r="1.7" />
        <circle cx="6.4" cy="3.8" r="1.6" />
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

.worktop {
  fill: #2b2622;
  stroke: #3d372f;
  stroke-width: 1;
}

.sheet {
  fill: #e3cfa6;
  stroke: #c9b184;
  stroke-width: 0.8;
}

.seams line {
  stroke: rgba(0, 0, 0, 0.18);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

.roll rect {
  fill: #cf9b3b;
  stroke: #a97c2c;
  stroke-width: 1;
}

.roll .sheen {
  fill: rgba(255, 255, 255, 0.18);
  stroke: none;
}

.cover {
  fill: #e3cfa6;
  stroke: none;
}

.cover.done {
  fill: #dbc79c;
}

.fold-edge {
  stroke: #c9b184;
  stroke-width: 0.9;
  stroke-linecap: round;
}

.guides line {
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-dasharray: 3 2;
  animation: pull 0.9s linear infinite;
}

/* Striche laufen nach innen — dorthin, wo der Teig hin soll. */
@keyframes pull {
  to {
    stroke-dashoffset: -5;
  }
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
}
</style>
