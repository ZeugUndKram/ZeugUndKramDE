<script setup lang="ts">
import { ref, computed } from 'vue'
import GameSprite from './GameSprite.vue'
import TaskHint from './TaskHint.vue'
import { INGREDIENTS } from '../../game/recipe'
import { shuffle } from '../../game/random'
import type { TaskState } from '../../game/task'

const props = defineProps<{
  goal: number
  /** Solange false, nimmt das Brett keine Eingaben an (Karte liegt noch davor) */
  active: boolean
}>()

const emit = defineEmits<{
  update: [state: TaskState]
  complete: [state: TaskState]
}>()

// Startplätze rund um die große Schüssel, in Prozent des Bretts.
const SLOTS = [
  { x: 12, y: 24 },
  { x: 34, y: 15 },
  { x: 66, y: 15 },
  { x: 88, y: 24 },
  { x: 8, y: 50 },
  { x: 92, y: 50 },
]

const CENTER = { x: 50, y: 70 }
const FOUL_MS = 400

interface Bowl {
  id: string
  label: string
  color: string
  home: { x: number; y: number }
  pos: { x: number; y: number }
  poured: boolean
}

// Die Reihenfolge wird bei jedem Anlauf neu ausgewürfelt.
const order = shuffle(INGREDIENTS).slice(0, props.goal)

// Die Schüsseln liegen in fester Plattreihenfolge, damit die Position nichts verrät.
const bowls = ref<Bowl[]>(
  shuffle(order).map((ing, i) => {
    const home = SLOTS[i % SLOTS.length]!
    return { ...ing, home, pos: { ...home }, poured: false }
  }),
)

const board = ref<HTMLElement | null>(null)
const dragId = ref<string | null>(null)
const attempts = ref(0)
const step = ref(0)
const foul = ref(false)
let foulTimer: ReturnType<typeof setTimeout> | undefined

const poured = computed(() => bowls.value.filter((b) => b.poured))
const nextUp = computed(() => order[step.value])
const accuracy = computed(() => (attempts.value === 0 ? 1 : step.value / attempts.value))

const state = (): TaskState => ({ done: step.value, accuracy: accuracy.value })

const flagFoul = () => {
  foul.value = true
  if (foulTimer) clearTimeout(foulTimer)
  foulTimer = setTimeout(() => (foul.value = false), FOUL_MS)
}

const toPercent = (event: PointerEvent) => {
  const rect = board.value?.getBoundingClientRect()
  if (!rect) return null
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  }
}

const startDrag = (bowl: Bowl, event: PointerEvent) => {
  if (!props.active || bowl.poured) return
  dragId.value = bowl.id
  board.value?.setPointerCapture(event.pointerId)
}

const onMove = (event: PointerEvent) => {
  if (!dragId.value) return
  const point = toPercent(event)
  if (!point) return
  const bowl = bowls.value.find((b) => b.id === dragId.value)
  if (bowl) bowl.pos = point
}

const endDrag = (event: PointerEvent) => {
  const bowl = bowls.value.find((b) => b.id === dragId.value)
  dragId.value = null
  if (board.value?.hasPointerCapture(event.pointerId)) {
    board.value.releasePointerCapture(event.pointerId)
  }
  if (!bowl) return

  const rect = board.value?.getBoundingClientRect()
  if (!rect) return

  // Abstand in Pixeln rechnen, sonst verzerrt das Seitenverhältnis den Radius.
  const dx = ((bowl.pos.x - CENTER.x) / 100) * rect.width
  const dy = ((bowl.pos.y - CENTER.y) / 100) * rect.height
  const inBowl = Math.hypot(dx, dy) < rect.width * 0.15

  if (!inBowl) {
    // Danebengesetzt zählt nicht als Versuch, nur als verlorene Zeit.
    bowl.pos = { ...bowl.home }
    return
  }

  attempts.value++

  if (bowl.id === nextUp.value?.id) {
    bowl.poured = true
    step.value++
  } else {
    // Falsche Zutat: kommt zurück und kostet Genauigkeit.
    bowl.pos = { ...bowl.home }
    flagFoul()
  }

  emit('update', state())
  if (step.value >= props.goal) emit('complete', state())
}
</script>

<template>
  <div
    ref="board"
    class="board"
    :class="{ locked: !active }"
    @pointermove="onMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <TaskHint v-if="nextUp" :label="nextUp.label" :foul="foul" />

    <div class="center-bowl" :class="{ ready: step >= goal }">
      <GameSprite name="bowl" />
      <div class="contents">
        <span
          v-for="bowl in poured"
          :key="bowl.id"
          class="blob"
          :style="{ backgroundColor: bowl.color }"
        />
      </div>
    </div>

    <button
      v-for="bowl in bowls"
      v-show="!bowl.poured"
      :key="bowl.id"
      type="button"
      class="bowl"
      :class="{ dragging: dragId === bowl.id }"
      :style="{ left: bowl.pos.x + '%', top: bowl.pos.y + '%' }"
      :aria-label="`${bowl.label} in die Schüssel ziehen`"
      @pointerdown.prevent="startDrag(bowl, $event)"
    >
      <GameSprite name="ingredient" :color="bowl.color" :label="bowl.label" />
    </button>
  </div>
</template>

<style scoped>
.board {
  position: absolute;
  inset: 0;
  touch-action: none;
  user-select: none;
}

.board.locked {
  pointer-events: none;
}

.center-bowl {
  position: absolute;
  left: 50%;
  top: 70%;
  width: 30%;
  transform: translate(-50%, -50%);
  transition: filter 0.3s ease;
}

.center-bowl.ready {
  filter: drop-shadow(0 0 18px rgba(137, 189, 139, 0.65));
}

/* Was schon drin ist, sammelt sich sichtbar im Schüsselrand. */
.contents {
  position: absolute;
  left: 50%;
  top: 32%;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  width: 62%;
  transform: translate(-50%, -50%);
}

.blob {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: drop-in 0.3s ease-out;
}

.bowl {
  position: absolute;
  width: 15%;
  min-width: 52px;
  padding: 0;
  border: none;
  background: none;
  transform: translate(-50%, -50%);
  cursor: grab;
  touch-action: none;
}

.bowl.dragging {
  cursor: grabbing;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6));
  transform: translate(-50%, -50%) scale(1.12);
  z-index: 5;
}

@keyframes drop-in {
  from {
    transform: translateY(-14px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
