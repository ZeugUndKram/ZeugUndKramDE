<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import TaskHint from './TaskHint.vue'
import SushiSlice from './SushiSlice.vue'
import type { Vec } from '../../game/shapes'
import {
  ROLL,
  SLICE_R,
  PLATE,
  LOOSE_Y,
  CUT_TOLERANCE,
  pieceWidth,
  buildSlots,
  nearestFreeSlot,
} from '../../game/cut'
import type { TaskState } from '../../game/task'

// PLATZHALTER-GRAFIKEN: Brett, Rolle, Messer und Teller sind hier als SVG
// gezeichnet. Die Trefferzonen stehen in game/cut.ts.

const props = defineProps<{
  goal: number
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

const FOUL_MS = 400

const slots = buildSlots(props.goal)
const width = pieceWidth(props.goal)

const surface = ref<SVGSVGElement | null>(null)
const taken = ref<boolean[]>(slots.map(() => false))
/** Wie viele Stücke schon von der Rolle abgetrennt sind */
const cuts = ref(0)
/** Liegt ein abgeschnittenes Stück bereit? */
const loose = ref(false)
const loosePos = ref<Vec>({ x: ROLL.left + width / 2, y: LOOSE_Y })
const carry = ref<Vec | null>(null)
const knife = ref<Vec | null>(null)
const attempts = ref(0)
const note = ref('')
const foul = ref(false)

let cutting = false
let foulTimer: ReturnType<typeof setTimeout> | undefined

const placedCount = computed(() => taken.value.filter(Boolean).length)
const accuracy = computed(() =>
  attempts.value === 0 ? 1 : placedCount.value / attempts.value,
)

const rollLeft = computed(() => ROLL.left + cuts.value * width)
/** Stücke, die noch an der Rolle hängen */
const remaining = computed(() => props.goal - cuts.value)
const cutX = computed(() => rollLeft.value + width)

/** Umriss der Rolle: links die Schnittkante, rechts noch rund */
const rollD = computed(() => {
  const radius = (ROLL.bottom - ROLL.top) / 2
  const end = ROLL.right - radius
  return `M ${rollLeft.value} ${ROLL.top} L ${end} ${ROLL.top} A ${radius} ${radius} 0 0 1 ${end} ${ROLL.bottom} L ${rollLeft.value} ${ROLL.bottom} Z`
})

const hoverSlot = computed(() =>
  carry.value ? nearestFreeSlot(carry.value, slots, taken.value) : -1,
)

const hint = computed(() => {
  if (note.value) return note.value
  if (carry.value) return 'Auf einen freien Platz legen'
  if (loose.value) return 'Stück auf den Teller legen'
  return 'An der Linie durchschneiden'
})

const state = (): TaskState => ({ done: placedCount.value, accuracy: accuracy.value })

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

/** Das letzte Stück muss nicht mehr abgeschnitten werden — es ist der Rest. */
const takeLastPiece = () => {
  if (loose.value || remaining.value !== 1) return
  loosePos.value = { x: rollLeft.value + width / 2, y: LOOSE_Y }
  cuts.value++
  loose.value = true
}

const start = (event: PointerEvent) => {
  if (!props.active) return
  const p = toViewBox(event)
  if (!p) return

  // Erst das lose Stück: es liegt vor der Rolle und will auf den Teller.
  if (loose.value && Math.hypot(p.x - loosePos.value.x, p.y - loosePos.value.y) <= SLICE_R + 3) {
    note.value = ''
    carry.value = p
    surface.value?.setPointerCapture(event.pointerId)
    return
  }

  // Sonst schneiden: von oberhalb der Rolle an der Linie ansetzen.
  if (loose.value || remaining.value <= 1) return
  if (p.y >= ROLL.top || Math.abs(p.x - cutX.value) > CUT_TOLERANCE) return

  note.value = ''
  cutting = true
  knife.value = p
  surface.value?.setPointerCapture(event.pointerId)
}

const move = (event: PointerEvent) => {
  const p = toViewBox(event)
  if (!p) return

  if (carry.value) {
    carry.value = p
    return
  }
  if (!cutting) return

  knife.value = p

  // Vom Strich abgekommen: der Schnitt wird schief und geht nicht durch.
  if (Math.abs(p.x - cutX.value) > CUT_TOLERANCE) {
    cutting = false
    knife.value = null
    attempts.value++
    flagFoul('Schnitt verrutscht')
    emit('update', state())
    return
  }

  // Ganz durch: das Stück fällt vor die Rolle.
  if (p.y >= ROLL.bottom) {
    cutting = false
    knife.value = null
    loosePos.value = { x: cutX.value - width / 2, y: LOOSE_Y }
    cuts.value++
    loose.value = true
    note.value = ''
  }
}

const end = (event: PointerEvent) => {
  if (surface.value?.hasPointerCapture(event.pointerId)) {
    surface.value.releasePointerCapture(event.pointerId)
  }

  const held = carry.value
  carry.value = null

  if (held) {
    attempts.value++
    const slot = nearestFreeSlot(held, slots, taken.value)
    if (slot < 0) {
      // Danebengelegt: das Stück rutscht zurück aufs Brett.
      flagFoul('Daneben — nochmal')
    } else {
      taken.value[slot] = true
      loose.value = false
      note.value = ''
      takeLastPiece()
    }
    emit('update', state())
    if (placedCount.value >= props.goal) emit('complete', state())
    return
  }

  if (cutting) {
    cutting = false
    knife.value = null
    attempts.value++
    flagFoul('Ganz durchschneiden')
    emit('update', state())
  }
}
</script>

<template>
  <div class="board">
    <TaskHint lead="In Stücke schneiden" :label="hint" :foul="foul" />

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
      <!-- Schneidebrett -->
      <rect class="cutting-board" x="3" y="22" width="52" height="52" rx="3" />

      <!-- Teller mit den Plätzen im Kreis -->
      <circle class="dish" :cx="PLATE.x" :cy="PLATE.y" :r="PLATE.r" />
      <circle class="dish-rim" :cx="PLATE.x" :cy="PLATE.y" :r="PLATE.r - 4" />
      <circle
        v-for="(slot, i) in slots"
        :key="`slot-${i}`"
        class="slot"
        :class="{ next: hoverSlot === i }"
        :cx="slot.x"
        :cy="slot.y"
        :r="SLICE_R"
      />

      <!-- Was schon liegt -->
      <template v-for="(slot, i) in slots" :key="`piece-${i}`">
        <SushiSlice v-if="taken[i]" :x="slot.x" :y="slot.y" :r="SLICE_R" />
      </template>

      <!-- Die Rolle, links mit Schnittkante -->
      <template v-if="remaining > 0">
        <path class="roll" :d="rollD" />
        <g class="cut-face">
          <ellipse :cx="rollLeft" :cy="(ROLL.top + ROLL.bottom) / 2" rx="2.2" :ry="SLICE_R" />
          <ellipse
            class="mustard"
            :cx="rollLeft"
            :cy="(ROLL.top + ROLL.bottom) / 2"
            rx="1.6"
            :ry="SLICE_R * 0.74"
          />
          <ellipse
            class="meat"
            :cx="rollLeft"
            :cy="(ROLL.top + ROLL.bottom) / 2"
            rx="1.2"
            :ry="SLICE_R * 0.56"
          />
        </g>
      </template>

      <!-- Wo der nächste Schnitt hingehört -->
      <line
        v-if="!loose && remaining > 1"
        class="cut-line"
        :x1="cutX"
        :x2="cutX"
        :y1="ROLL.top - 13"
        :y2="ROLL.bottom + 5"
      />

      <!-- Das lose Stück auf dem Brett -->
      <SushiSlice
        v-if="loose && !carry"
        :x="loosePos.x"
        :y="loosePos.y"
        :r="SLICE_R"
      />

      <!-- Stück am Zeiger -->
      <g v-if="carry" class="carried">
        <SushiSlice :x="carry.x" :y="carry.y" :r="SLICE_R" />
      </g>

      <!-- Messer -->
      <g v-if="knife" class="knife" :transform="`translate(${knife.x} ${knife.y})`">
        <rect class="blade" x="-1.7" y="-14" width="3.4" height="14" rx="0.6" />
        <rect class="handle" x="-2.6" y="-20" width="5.2" height="6.5" rx="1.4" />
      </g>
    </svg>

    <p class="counter">{{ placedCount }} / {{ goal }}</p>
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

.cutting-board {
  fill: #4a3a2a;
  stroke: #5f4c37;
  stroke-width: 1;
}

.dish {
  fill: #f2efe8;
  stroke: #cfcabd;
  stroke-width: 1;
}

.dish-rim {
  fill: #e7e2d7;
  stroke: none;
}

.slot {
  fill: rgba(0, 0, 0, 0.06);
  stroke: rgba(0, 0, 0, 0.25);
  stroke-width: 0.6;
  stroke-dasharray: 2 1.6;
  transition: fill 0.15s ease;
}

.slot.next {
  fill: rgba(76, 154, 85, 0.28);
  stroke: var(--brand-green);
  stroke-dasharray: none;
}

.roll {
  fill: #d8b878;
  stroke: #b8964f;
  stroke-width: 0.8;
}

.cut-face ellipse {
  fill: #d8b878;
  stroke: #b8964f;
  stroke-width: 0.5;
}

.cut-face .mustard {
  fill: #cf9b3b;
  stroke: none;
}

.cut-face .meat {
  fill: #d09a90;
  stroke: none;
}

.cut-line {
  stroke: rgba(255, 255, 255, 0.6);
  stroke-width: 0.9;
  stroke-dasharray: 2.5 2;
  animation: slide 0.9s linear infinite;
}

/* Striche laufen nach unten — in Schnittrichtung. */
@keyframes slide {
  to {
    stroke-dashoffset: -4.5;
  }
}

.carried {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.55));
  pointer-events: none;
}

.knife {
  pointer-events: none;
}

.knife .blade {
  fill: #d8dde2;
  stroke: #9aa3ab;
  stroke-width: 0.5;
}

.knife .handle {
  fill: #33302c;
  stroke: #4a453e;
  stroke-width: 0.5;
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
  .cut-line {
    animation: none;
  }
}
</style>
