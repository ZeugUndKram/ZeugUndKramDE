<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import StepCard from '../../components/game/StepCard.vue'
import DoneStamp from '../../components/game/DoneStamp.vue'
import PourTask from '../../components/game/PourTask.vue'
import StirTask from '../../components/game/StirTask.vue'
import FoilTask from '../../components/game/FoilTask.vue'
import FillTask from '../../components/game/FillTask.vue'
import OvenTask from '../../components/game/OvenTask.vue'
import PressTask from '../../components/game/PressTask.vue'
import PaintTask from '../../components/game/PaintTask.vue'
import WrapTask from '../../components/game/WrapTask.vue'
import CutTask from '../../components/game/CutTask.vue'
import SushiPlate from '../../components/game/SushiPlate.vue'
import { RECIPE, FINAL_STEP_ID } from '../../game/recipe'
import type { TaskState } from '../../game/task'
import { stepScore, verdictFor, type StepResult } from '../../game/scoring'

// Neue Rezeptschritte: Eintrag in RECIPE ergaenzen und die Task-Komponente hier
// unter dem passenden Schluessel eintragen.
const TASKS = {
  pour: PourTask,
  stir: StirTask,
  foil: FoilTask,
  fill: FillTask,
  oven: OvenTask,
  press: PressTask,
  paint: PaintTask,
  wrap: WrapTask,
  cut: CutTask,
}

const DONE_STAMP_MS = 1300
const TICK_MS = 100

type Phase = 'intro' | 'card' | 'play' | 'done' | 'result'

const phase = ref<Phase>('intro')
const stepIndex = ref(0)
const results = ref<StepResult[]>([])
const timeLeft = ref(0)
const latest = ref<TaskState>({ done: 0, accuracy: 1 })
// Erzwingt ein frisches Task-Bauteil, auch wenn derselbe Schritt neu startet.
const runId = ref(0)

// Sprungleiste zum Testen: im Dev-Server immer, im Live-Build nur mit ?debug
const route = useRoute()
const debug = computed(() => import.meta.env.DEV || route.query.debug !== undefined)

let timer: ReturnType<typeof setInterval> | undefined
let stampTimer: ReturnType<typeof setTimeout> | undefined

const step = computed(() => RECIPE[stepIndex.value]!)
const verdict = computed(() => verdictFor(results.value))

// Das Abschlussbild zeigt den Teller so, wie er am Ende wirklich aussah.
const finalStep = computed(() => RECIPE.find((entry) => entry.id === FINAL_STEP_ID))
const sushiTotal = computed(() => finalStep.value?.goal ?? 6)
const sushiPieces = computed(
  () => results.value.find((result) => result.id === FINAL_STEP_ID)?.done ?? 0,
)
const timeRatio = computed(() => (step.value ? timeLeft.value / step.value.timeLimit : 0))

const clearTimers = () => {
  if (timer) clearInterval(timer)
  if (stampTimer) clearTimeout(stampTimer)
  timer = undefined
  stampTimer = undefined
}

const startGame = (from = 0) => {
  clearTimers()
  stepIndex.value = from
  results.value = []
  runId.value++
  phase.value = 'card'
}

const beginStep = () => {
  clearTimers()
  latest.value = { done: 0, accuracy: 1 }
  timeLeft.value = step.value.timeLimit
  phase.value = 'play'

  timer = setInterval(() => {
    timeLeft.value = Math.max(0, timeLeft.value - TICK_MS / 1000)
    if (timeLeft.value <= 0) finishStep()
  }, TICK_MS)
}

const finishStep = () => {
  if (phase.value !== 'play') return
  clearTimers()

  results.value.push({
    id: step.value.id,
    title: step.value.title,
    done: latest.value.done,
    goal: step.value.goal,
    accuracy: latest.value.accuracy,
    timeUsed: step.value.timeLimit - timeLeft.value,
    timeLimit: step.value.timeLimit,
  })

  phase.value = 'done'
  stampTimer = setTimeout(() => {
    stepIndex.value++
    phase.value = stepIndex.value >= RECIPE.length ? 'result' : 'card'
  }, DONE_STAMP_MS)
}

const onUpdate = (state: TaskState) => {
  latest.value = state
}

const onComplete = (state: TaskState) => {
  latest.value = state
  finishStep()
}

onUnmounted(clearTimers)
</script>

<template>
  <main class="game-page">
    <header class="masthead">
      <router-link to="/zeugzember" class="back">← Zeugzember</router-link>
      <h1>Leberkässushi</h1>
    </header>

    <!-- Nur zum Testen. Im Live-Build erst mit ?debug in der Adresse sichtbar. -->
    <nav v-if="debug" class="debug-bar">
      <span class="debug-label">Test</span>
      <button
        v-for="(entry, i) in RECIPE"
        :key="entry.id"
        type="button"
        :class="{ current: phase !== 'intro' && phase !== 'result' && stepIndex === i }"
        :title="entry.title"
        @click="startGame(i)"
      >
        {{ i + 1 }}. {{ entry.title }}
      </button>
      <button type="button" @click="phase = 'result'">Ergebnis</button>
    </nav>

    <div class="stage">
      <!-- Startbildschirm -->
      <div v-if="phase === 'intro'" class="overlay">
        <div class="panel">
          <h2>Leberkässushi</h2>
          <p>
            Koch das Rezept Schritt für Schritt nach. Tempo und Sauberkeit
            entscheiden am Ende die Wertung.
          </p>
          <p class="small">{{ RECIPE.length }} Schritte — weitere folgen.</p>
          <button class="btn-primary" @click="startGame()">Kochen</button>
        </div>
      </div>

      <!-- Ergebnis -->
      <div v-else-if="phase === 'result'" class="overlay">
        <div class="panel">
          <SushiPlate class="dish" :pieces="sushiPieces" :total="sushiTotal" />
          <p class="dish-caption">
            {{ sushiPieces }} von {{ sushiTotal }} Stück auf dem Teller
          </p>

          <span class="medal" :class="verdict.medal">{{ verdict.title }}</span>
          <p class="verdict-note">{{ verdict.note }}</p>

          <ul class="score-list">
            <li v-for="result in results" :key="result.id">
              <span class="name">{{ result.title }}</span>
              <span class="detail">
                {{ result.done }}/{{ result.goal }} · {{ Math.round(result.accuracy * 100) }}% ·
                {{ result.timeUsed.toFixed(1) }}s
              </span>
              <span class="points">{{ stepScore(result) }}</span>
            </li>
          </ul>

          <p class="total">{{ verdict.points }} <span>von {{ verdict.max }}</span></p>
          <button class="btn-primary" @click="startGame()">Nochmal</button>
        </div>
      </div>

      <!-- Spielbrett -->
      <template v-else>
        <div class="hud">
          <span class="hud-title">{{ step.title }}</span>
          <div class="time-bar">
            <div
              class="time-fill"
              :class="{ urgent: timeRatio < 0.25 }"
              :style="{ width: timeRatio * 100 + '%' }"
            />
          </div>
          <span class="hud-count">{{ latest.done }} / {{ step.goal }}</span>
        </div>

        <div class="board-area">
          <component
            :is="TASKS[step.task]"
            :key="`${step.id}-${runId}`"
            :goal="step.goal"
            :active="phase === 'play'"
            v-bind="step.props ?? {}"
            @update="onUpdate"
            @complete="onComplete"
          />

          <StepCard
            v-if="phase === 'card'"
            :step="step"
            :index="stepIndex"
            :total="RECIPE.length"
            @start="beginStep"
          />

          <DoneStamp v-if="phase === 'done'" />
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - var(--header-height));
  padding: 1.5rem 1rem 3rem;
}

.masthead {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-bottom: 1rem;
}

.back {
  font-family: var(--font-header);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--text-faint);
}

.back:hover {
  color: var(--brand-green);
}

h1 {
  font-family: var(--font-header);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--brand-green);
}

.stage {
  position: relative;
  width: 100%;
  max-width: 900px;
}

/* --- Sprungleiste zum Testen --- */
.debug-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  max-width: 900px;
  margin-bottom: 0.8rem;
  padding: 0.5rem 0.7rem;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
}

.debug-label {
  margin-right: 0.3rem;
  font-family: var(--font-header);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-faint);
}

.debug-bar button {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text-dim);
  font-family: var(--font-header);
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}

.debug-bar button:hover {
  border-color: var(--brand-green);
  color: var(--text);
}

.debug-bar button.current {
  border-color: var(--brand-green);
  color: var(--brand-green);
}

/* --- HUD --- */
.hud {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.hud-title,
.hud-count {
  font-family: var(--font-header);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

.hud-title {
  color: var(--text-muted);
}

.hud-count {
  color: var(--brand-green);
}

.time-bar {
  flex: 1;
  height: 8px;
  border-radius: 10px;
  background: var(--line);
  overflow: hidden;
}

.time-fill {
  height: 100%;
  background: var(--brand-green);
  transition: width 0.1s linear;
}

.time-fill.urgent {
  background: #d9534f;
}

/* --- Brett --- */
.board-area {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: radial-gradient(circle at 50% 60%, #1d1d1d, #121212 70%);
  overflow: hidden;
}

/* --- Start und Ergebnis --- */
/* Kein festes Seitenverhaeltnis: die Ergebnisliste waechst mit den
   Rezeptschritten und darf nicht abgeschnitten werden. */
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: min(60vh, 480px);
  padding: 2rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.panel {
  width: 100%;
  max-width: 460px;
  text-align: center;
}

.panel h2 {
  margin-bottom: 1rem;
  font-family: var(--font-header);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--brand-green);
}

.panel p {
  margin-bottom: 1rem;
  color: var(--text-soft);
}

.panel .small {
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: var(--text-faint);
}

.dish {
  width: min(230px, 62%);
  margin: 0 auto 0.6rem;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
}

/* Mit .panel davor, sonst gewinnt die allgemeine `.panel p`-Regel darüber. */
.panel .dish-caption {
  margin-bottom: 1.5rem;
  font-family: var(--font-header);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-faint);
}

.medal {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-header);
  font-size: clamp(2.2rem, 8vw, 3.4rem);
  font-weight: 900;
  text-transform: uppercase;
}

.medal.gold {
  color: #f0c040;
}
.medal.silber {
  color: #cfd4d8;
}
.medal.bronze {
  color: #c08040;
}
.medal.roh {
  color: var(--text-faint);
}

.verdict-note {
  margin-bottom: 1.5rem;
  color: var(--text-dim);
}

.score-list {
  margin-bottom: 1.5rem;
  padding: 0;
  list-style: none;
  text-align: left;
}

.score-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);
}

.score-list .name {
  font-family: var(--font-header);
  font-weight: 700;
  color: var(--text);
}

.score-list .detail {
  grid-column: 1;
  font-size: 0.8rem;
  color: var(--text-faint);
}

.score-list .points {
  grid-row: 1 / span 2;
  grid-column: 2;
  align-self: center;
  font-family: var(--font-header);
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--brand-green);
}

.total {
  margin-bottom: 2rem;
  font-family: var(--font-header);
  font-size: 2rem;
  font-weight: 900;
  color: var(--text);
}

.total span {
  font-size: 1rem;
  color: var(--text-faint);
}

@media (max-width: 600px) {
  .board-area {
    aspect-ratio: 3 / 4;
  }
}
</style>
