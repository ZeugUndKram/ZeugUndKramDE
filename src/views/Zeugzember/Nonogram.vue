<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// --- Hardcoded Multi-Level Puzzle Array Matrix ---
const PUZZLES = [
  {
    name: "Vector Mega Matrix Prime (80x30)",
    // Generates a complex layout featuring architectural pillars and an underlying cosmic landscape pattern
    grid: Array(30).fill(null).map((_, r) => 
      Array(80).fill(null).map((_, c) => {
        // Procedural nonogram map layout algorithm (perfectly solvable geometric shapes)
        const isPillar = (c % 10 === 0 || c % 10 === 1) && r > 2 && r < 25;
        const isHorizon = r === 20 && c > 5 && c < 75;
        const isArch = r < 6 && ((c > 8 && c < 12) || (c > 28 && c < 32) || (c > 48 && c < 52) || (c > 68 && c < 72));
        const isMountain = r > 12 && r <= 20 && Math.abs((c % 20) - 10) + r >= 22;
        const isGroundBase = r >= 25 && c > 2 && c < 78 && (r + c) % 2 === 0;
        return (isPillar || isHorizon || isArch || isMountain || isGroundBase) ? 1 : 0;
      })
    )
  },
  {
    name: "Vector Array Alpha (5x5)",
    grid: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    name: "Vector Array Beta (10x10)",
    grid: [
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    name: "Vector Array Gamma (10x10)",
    grid: [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
    ]
  }
]

const currentLevelIdx = ref(0)
const activePuzzle = computed(() => PUZZLES[currentLevelIdx.value])

const GRID_ROWS = computed(() => activePuzzle.value.grid.length)
const GRID_COLS = computed(() => activePuzzle.value.grid[0].length)

const playerGrid = ref<number[][]>([])
const errorGrid = ref<boolean[][]>([])

const manualRowClues = ref<Record<string, boolean>>({})
const manualColClues = ref<Record<string, boolean>>({})

const completedRowsTracker = ref<boolean[]>([])
const completedColsTracker = ref<boolean[]>([])

const isDrawing = ref(false)
const drawMode = ref<number | null>(null) 
const isFinished = ref(false)
const errorChecked = ref(false)
const remainingHints = ref(3)

const timeElapsed = ref(0)
let timerInterval: any = null

function initLevel() {
  const rows = GRID_ROWS.value
  const cols = GRID_COLS.value
  
  playerGrid.value = Array(rows).fill(null).map(() => Array(cols).fill(0))
  errorGrid.value = Array(rows).fill(null).map(() => Array(cols).fill(false))
  
  completedRowsTracker.value = Array(rows).fill(false)
  completedColsTracker.value = Array(cols).fill(false)
  
  manualRowClues.value = {}
  manualColClues.value = {}
  errorChecked.value = false
  isFinished.value = false
  remainingHints.value = 3
  
  startTimer()
}

// Adaptive sizing grid math setup supporting 80x30 viewport containment
const cellSizeCSS = computed(() => {
  if (GRID_COLS.value > 50) {
    return `minmax(8px, calc(72vw / ${GRID_COLS.value}))`
  }
  const maxDim = Math.max(GRID_ROWS.value, GRID_COLS.value)
  return `minmax(16px, calc(56vh / ${maxDim}))`
})

const unifiedGridStyles = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `minmax(90px, max-content) repeat(${GRID_COLS.value}, ${cellSizeCSS.value})`,
    gridTemplateRows: `minmax(90px, max-content) repeat(${GRID_ROWS.value}, ${cellSizeCSS.value})`
  }
})

// --- Line Clue Generators ---
function generateLineClues(line: number[]): number[] {
  const clues: number[] = []
  let count = 0
  for (const val of line) {
    if (val === 1) { count++ } 
    else if (count > 0) { clues.push(count); count = 0 }
  }
  if (count > 0) clues.push(count)
  return clues.length === 0 ? [0] : clues
}

const rowClues = computed(() => activePuzzle.value.grid.map(row => generateLineClues(row)))
const colClues = computed(() => {
  const clues = []
  for (let c = 0; c < GRID_COLS.value; c++) {
    const column = activePuzzle.value.grid.map(row => row[c])
    clues.push(generateLineClues(column))
  }
  return clues
})

/**
 * INTELLIGENT NONOGRAM CLUE COMPLETION DETECTOR
 * Scans player placement lines against the puzzle's targets. It checks if the placed blocks
 * correctly match the sequential targets and dims them sequentially from left/right parameters.
 */
function evaluateLineProgress(playerLine: number[], targetSolutionLine: number[], targetClues: number[]): boolean[] {
  const checkedFlags = Array(targetClues.length).fill(false)
  if (targetClues.length === 1 && targetClues[0] === 0) return checkedFlags

  // Isolate current continuous filled blocks built by the player
  interface Block { size: number; start: number; end: number }
  const playerBlocks: Block[] = []
  let length = 0
  let startIdx = -1

  for (let i = 0; i < playerLine.length; i++) {
    if (playerLine[i] === 1) {
      if (length === 0) startIdx = i
      length++
    } else {
      if (length > 0) {
        playerBlocks.push({ size: length, start: startIdx, end: i - 1 })
        length = 0
      }
    }
  }
  if (length > 0) {
    playerBlocks.push({ size: length, start: startIdx, end: playerLine.length - 1 })
  }

  if (playerBlocks.length === 0) return checkedFlags

  // Match and verify blocks from left to right indices
  let clueL = 0
  let blockL = 0
  while (blockL < playerBlocks.length && clueL < targetClues.length) {
    const currentBlock = playerBlocks[blockL]
    // Verify block is identical in dimension and aligns with correct puzzle vectors
    const isValidMatch = currentBlock.size === targetClues[clueL] && 
                         targetSolutionLine[currentBlock.start] === 1 && 
                         targetSolutionLine[currentBlock.end] === 1
    if (isValidMatch) {
      checkedFlags[clueL] = true
      clueL++
      blockL++
    } else {
      break
    }
  }

  // Match and verify blocks from right to left indices
  let clueR = targetClues.length - 1
  let blockR = playerBlocks.length - 1
  while (blockR >= blockL && clueR >= clueL) {
    const currentBlock = playerBlocks[blockR]
    const isValidMatch = currentBlock.size === targetClues[clueR] && 
                         targetSolutionLine[currentBlock.start] === 1 && 
                         targetSolutionLine[currentBlock.end] === 1
    if (isValidMatch) {
      checkedFlags[clueR] = true
      clueR--
      blockR--
    } else {
      break
    }
  }

  return checkedFlags
}

const autoCheckedRowClues = computed(() => {
  const flags: Record<string, boolean> = {}
  for (let r = 0; r < GRID_ROWS.value; r++) {
    const lineResults = evaluateLineProgress(playerGrid.value[r], activePuzzle.value.grid[r], rowClues.value[r])
    lineResults.forEach((status, clIdx) => {
      if (status) flags[`${r}-${clIdx}`] = true
    })
  }
  return flags
})

const autoCheckedColClues = computed(() => {
  const flags: Record<string, boolean> = {}
  for (let c = 0; c < GRID_COLS.value; c++) {
    const playerColumn = playerGrid.value.map(row => row[c])
    const solutionColumn = activePuzzle.value.grid.map(row => row[c])
    const lineResults = evaluateLineProgress(playerColumn, solutionColumn, colClues.value[c])
    lineResults.forEach((status, clIdx) => {
      if (status) flags[`${c}-${clIdx}`] = true
    })
  }
  return flags
})

// --- Control Interactions ---
function handleCellMouseDown(r: number, c: number, event: MouseEvent) {
  if (isFinished.value) return
  event.preventDefault()
  isDrawing.value = true
  
  const currentVal = playerGrid.value[r][c]
  if (event.button === 0) { 
    drawMode.value = currentVal === 1 ? 0 : 1 
  } else if (event.button === 2) { 
    drawMode.value = currentVal === 2 ? 0 : 2 
  }
  applyDraw(r, c)
}

function handleCellMouseEnter(r: number, c: number) {
  if (!isDrawing.value) return
  applyDraw(r, c)
}

function stopDrawing() {
  if (!isDrawing.value) return
  isDrawing.value = false
  drawMode.value = null
  autoFillXs()
  checkWinCondition()
}

function applyDraw(r: number, c: number) {
  if (drawMode.value === null || isFinished.value) return
  playerGrid.value[r][c] = drawMode.value
  if (errorChecked.value) errorGrid.value[r][c] = false
}

function autoFillXs() {
  if (isFinished.value) return

  for (let r = 0; r < GRID_ROWS.value; r++) {
    const targetFilledCount = rowClues.value[r].reduce((sum, val) => sum + val, 0)
    const actualTarget = rowClues.value[r][0] === 0 ? 0 : targetFilledCount
    const currentFilledCount = playerGrid.value[r].filter(cell => cell === 1).length

    if (currentFilledCount === actualTarget) {
      if (!completedRowsTracker.value[r]) {
        for (let c = 0; c < GRID_COLS.value; c++) {
          if (playerGrid.value[r][c] === 0) playerGrid.value[r][c] = 2
        }
        completedRowsTracker.value[r] = true 
      }
    } else {
      completedRowsTracker.value[r] = false
    }
  }

  for (let c = 0; c < GRID_COLS.value; c++) {
    const targetFilledCount = colClues.value[c].reduce((sum, val) => sum + val, 0)
    const actualTarget = colClues.value[c][0] === 0 ? 0 : targetFilledCount
    
    let currentFilledCount = 0
    for (let r = 0; r < GRID_ROWS.value; r++) {
      if (playerGrid.value[r][c] === 1) currentFilledCount++
    }

    if (currentFilledCount === actualTarget) {
      if (!completedColsTracker.value[c]) {
        for (let r = 0; r < GRID_ROWS.value; r++) {
          if (playerGrid.value[r][c] === 0) playerGrid.value[r][c] = 2
        }
        completedColsTracker.value[c] = true 
      }
    } else {
      completedColsTracker.value[c] = false
    }
  }
}

function checkWinCondition() {
  const target = activePuzzle.value.grid
  for (let r = 0; r < GRID_ROWS.value; r++) {
    for (let c = 0; c < GRID_COLS.value; c++) {
      if ((target[r][c] === 1) !== (playerGrid.value[r][c] === 1)) return
    }
  }
  isFinished.value = true
  stopTimer()
}

function checkErrors() {
  if (isFinished.value) return
  errorChecked.value = true
  const target = activePuzzle.value.grid
  for (let r = 0; r < GRID_ROWS.value; r++) {
    for (let c = 0; c < GRID_COLS.value; c++) {
      const filledWrong = playerGrid.value[r][c] === 1 && target[r][c] !== 1
      const crossedWrong = playerGrid.value[r][c] === 2 && target[r][c] === 1
      errorGrid.value[r][c] = filledWrong || crossedWrong
    }
  }
}

function triggerHint() {
  if (remainingHints.value <= 0 || isFinished.value) return
  const target = activePuzzle.value.grid
  const pool: {r: number, c: number}[] = []
  
  for (let r = 0; r < GRID_ROWS.value; r++) {
    for (let c = 0; c < GRID_COLS.value; c++) {
      if (target[r][c] === 1 && playerGrid.value[r][c] !== 1) {
        pool.push({ r, c })
      }
    }
  }
  if (pool.length > 0) {
    const choice = pool[Math.floor(Math.random() * pool.length)]
    playerGrid.value[choice.r][choice.c] = 1
    remainingHints.value--
    autoFillXs()
    checkWinCondition()
  }
}

function advanceNextLevel() {
  currentLevelIdx.value = (currentLevelIdx.value + 1) % PUZZLES.length
  initLevel()
}

const toggleRowClue = (rIdx: number, cIdx: number) => {
  const key = `${rIdx}-${cIdx}`; manualRowClues.value[key] = !manualRowClues.value[key]
}
const toggleColClue = (cIdx: number, clIdx: number) => {
  const key = `${cIdx}-${clIdx}`; manualColClues.value[key] = !manualColClues.value[key]
}

function startTimer() {
  stopTimer()
  timeElapsed.value = 0
  timerInterval = setInterval(() => { timeElapsed.value++ }, 1000)
}
function stopTimer() { if (timerInterval) clearInterval(timerInterval) }
function formatTime(s: number): string {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

onMounted(() => initLevel())
onUnmounted(() => stopTimer())
</script>

<template>
  <div class="viewport-fullscreen-container" @mouseup="stopDrawing" @mouseleave="stopDrawing">
    
    <aside class="hud-sidebar">
      <div class="branding-node">
        <h1>LOGIC <span class="mono-glow">MONO</span></h1>
        <p class="subtitle">Dynamic screen-adaptive monochrome execution stage.</p>
      </div>

      <div class="hud-card dynamic-puzzle-info">
        <div class="hud-label">ACTIVE SECTOR ARCHIVE</div>
        <div class="puzzle-title-text">{{ activePuzzle.name }}</div>
      </div>

      <div class="hud-card active-timer-box">
        <div class="hud-label">ANALYSIS DURATION</div>
        <div class="hud-value font-mono">{{ formatTime(timeElapsed) }}</div>
      </div>

      <div class="hud-card system-controls">
        <button @click="checkErrors" class="btn btn-primary" :disabled="isFinished">
          🔍 Verify Core Vectors
        </button>
        <button @click="triggerHint" class="btn btn-outline" :disabled="remainingHints <= 0 || isFinished">
          💡 Deploy Correct Node ({{ remainingHints }} Left)
        </button>
        <button @click="initLevel" class="btn btn-secondary">
          🔄 Flush Cache & Reset
        </button>
      </div>
    </aside>

    <main class="canvas-playspace" @contextmenu.prevent>
      <div class="scroll-wrapper-container">
        <div class="unified-nonogram-matrix" :style="unifiedGridStyles">
          
          <div class="grid-corner-spacer">
            <div class="input-legend">
              <div>L-CLICK: DRAW</div>
              <div>R-CLICK: MASK</div>
            </div>
          </div>

          <div 
            v-for="(stack, cIdx) in colClues" 
            :key="'col-stack-'+cIdx" 
            class="column-header-stack"
            :class="{ 'thick-border-right': (cIdx + 1) % 5 === 0 && cIdx !== GRID_COLS - 1 }"
          >
            <span 
              v-for="(clue, clIdx) in stack" 
              :key="'col-clue-'+cIdx+'-'+clIdx"
              class="clue-digit"
              :class="{ 'clue-crossed': manualColClues[`${cIdx}-${clIdx}`] || autoCheckedColClues[`${cIdx}-${clIdx}`] }"
              @click="toggleColClue(cIdx, clIdx)"
            >
              {{ clue }}
            </span>
          </div>

          <template v-for="(row, rIdx) in playerGrid" :key="'row-group-'+rIdx">
            
            <div 
              class="row-header-strip"
              :class="{ 'thick-border-bottom': (rIdx + 1) % 5 === 0 && rIdx !== GRID_ROWS - 1 }"
            >
              <span 
                v-for="(clue, clIdx) in rowClues[rIdx]" 
                :key="'row-clue-'+rIdx+'-'+clIdx"
                class="clue-digit"
                :class="{ 'clue-crossed': manualRowClues[`${rIdx}-${clIdx}`] || autoCheckedRowClues[`${rIdx}-${clIdx}`] }"
                @click="toggleRowClue(rIdx, clIdx)"
              >
                {{ clue }}
              </span>
            </div>

            <div 
              v-for="(cell, cIdx) in row" 
              :key="'cell-'+rIdx+'-'+cIdx"
              class="square-grid-cell"
              :class="{
                'cell-state-filled': cell === 1,
                'cell-state-crossed': cell === 2,
                'cell-state-error': errorChecked && errorGrid[rIdx]?.[cIdx],
                'thick-border-right': (cIdx + 1) % 5 === 0 && cIdx !== GRID_COLS - 1,
                'thick-border-bottom': (rIdx + 1) % 5 === 0 && rIdx !== GRID_ROWS - 1
              }"
              @mousedown="handleCellMouseDown(rIdx, cIdx, $event)"
              @mouseenter="handleCellMouseEnter(rIdx, cIdx)"
            >
              <span v-if="cell === 2" class="x-glyph">✕</span>
            </div>

          </template>

        </div>
      </div>
    </main>

    <div v-if="isFinished" class="modal-overlay-backdrop animated-fade-in">
      <div class="victory-modal-wrapper animated-scale-up">
        <div class="modal-glow-edge"></div>
        <div class="modal-flex-layout">
          
          <div class="victory-modal-content">
            <h2 class="victory-headline">Finished!</h2>
            <p class="victory-sub-desc">Spatial vector geometry calculations fully compiled.</p>
            
            <div class="completion-metrics-box">
              <div class="metric-item">
                <span class="m-lbl">Target Array Node</span>
                <span class="m-val">{{ activePuzzle.name }}</span>
              </div>
              <div class="metric-item">
                <span class="m-lbl">Speed Performance</span>
                <span class="m-val font-mono">{{ formatTime(timeElapsed) }}</span>
              </div>
            </div>

            <button @click="advanceNextLevel" class="btn btn-primary btn-large btn-block">
              Next Puzzle →
            </button>
          </div>

          <div class="victory-preview-panel">
            <div class="preview-header-label">COMPLETED GEOMETRY RENDER</div>
            <div class="mini-preview-container">
              <div 
                class="mini-preview-grid" 
                :style="{
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
                }"
              >
                <template v-for="(row, r) in activePuzzle.grid" :key="'preview-row-'+r">
                  <div 
                    v-for="(cell, c) in row" 
                    :key="'preview-cell-'+r+'-'+c"
                    class="mini-preview-cell"
                    :class="{ 'mini-cell-filled': cell === 1 }"
                  ></div>
                </template>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<style>
:root {
  --bg-dark-base: #040404;
  --bg-dark-sidebar: #0b0b0b;
  --border-primary: #1c1c1c;
  --border-grid-line: #222222;
  
  --cell-empty: #0e0e0e;
  --cell-filled: #ffffff;
  --cell-crossed: #151515;
  
  --system-error: #ff3333;
  --system-error-dim: rgba(255, 51, 51, 0.2);
  
  --text-main: #ffffff;
  --text-dim: #555555;
  --font-display: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
}

body {
  margin: 0; padding: 0;
  background-color: var(--bg-dark-base);
  color: var(--text-main);
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

.viewport-fullscreen-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.hud-sidebar {
  width: 300px;
  background-color: var(--bg-dark-sidebar);
  border-right: 1px solid var(--border-primary);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  box-sizing: border-box;
  flex-shrink: 0;
}

.branding-node h1 {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 1.3rem;
  margin: 0;
}
.branding-node .mono-glow {
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.branding-node .subtitle {
  font-size: 0.7rem;
  color: var(--text-dim);
  margin: 0.2rem 0 0 0;
}

.hud-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 1rem;
}
.hud-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #444;
}
.puzzle-title-text {
  font-size: 0.85rem;
  font-weight: 700;
}
.hud-value {
  font-size: 1.6rem;
  font-weight: 800;
}

.system-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.canvas-playspace {
  flex: 1;
  height: 100%;
  overflow: auto; /* Active scrolling layer for big grids */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.scroll-wrapper-container {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 10px;
}

.unified-nonogram-matrix {
  background-color: var(--border-grid-line);
  border: 2px solid #333;
  border-radius: 4px;
  gap: 1px;
}

.grid-corner-spacer {
  background-color: var(--bg-dark-base);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0.4rem;
}
.input-legend {
  font-size: 0.5rem;
  color: #333;
  line-height: 1.2;
}

.column-header-stack {
  background-color: #060606;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0.3rem 0;
  gap: 0.1rem;
}

.row-header-strip {
  background-color: #060606;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 0.5rem;
  gap: 0.3rem;
}

.clue-digit {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 0.72rem;
  color: #ffffff;
  user-select: none;
}

/* AUTOMATIC COMPLETED CLUE LOOKS */
.clue-crossed {
  text-decoration: line-through;
  color: #1c1c1c !important;
  opacity: 0.4;
}

.square-grid-cell {
  background-color: var(--cell-empty);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
}

.thick-border-right {
  border-right: 2px solid #444444 !important;
}
.thick-border-bottom {
  border-bottom: 2px solid #444444 !important;
}

.cell-state-filled {
  background-color: var(--cell-filled) !important;
}

.cell-state-crossed {
  background-color: var(--cell-crossed) !important;
}

/* MODIFIED HIGH VISIBILITY CONTRAST FOR PLACED X MARKERS */
.x-glyph {
  color: #666666 !important; 
  font-weight: 900;
  font-size: 0.7rem;
  user-select: none;
}

.cell-state-error {
  animation: errorBorderFlash 0.5s infinite alternate;
  background-color: var(--system-error-dim) !important;
}

/* --- GAME COMPLETE OVERLAY LAYOUT --- */
.modal-overlay-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.victory-modal-wrapper {
  background-color: #0c0c0c;
  border: 1px solid #222;
  width: 90%;
  max-width: 700px;
  border-radius: 8px;
  overflow: hidden;
}

.modal-flex-layout {
  display: flex;
}

.victory-modal-content {
  flex: 1.2;
  padding: 2.5rem;
}

.victory-headline {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}
.victory-sub-desc {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin: 0 0 1.5rem 0;
}

.completion-metrics-box {
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid #1c1c1c;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.metric-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.victory-preview-panel {
  flex: 0.8;
  background-color: #030303;
  border-left: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.preview-header-label {
  font-size: 0.6rem;
  color: #444;
  margin-bottom: 1rem;
}

.mini-preview-container {
  background-color: #111;
  padding: 8px;
  border: 1px solid #222;
  width: 100%;
  max-width: 160px;
}

.mini-preview-grid {
  display: grid;
  gap: 1px;
}
.mini-preview-cell {
  background-color: #050505;
  aspect-ratio: 1/1;
}
.mini-preview-cell.mini-cell-filled {
  background-color: #fff;
}

/* BUTTONS UI */
.btn {
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  border: 1px solid transparent;
}
.btn-block { display: block; width: 100%; }
.btn-primary { background-color: #fff; color: #000; }
.btn-secondary { background-color: #111; color: #fff; border-color: #222; }
.btn-outline { background-color: transparent; color: #fff; border-color: #222; }
.btn:disabled { opacity: 0.2; cursor: not-allowed; }

@keyframes errorBorderFlash {
  from { border: 1px solid rgba(255, 51, 51, 0.1); }
  to { border: 1px solid rgba(255, 51, 51, 0.7); }
}
</style>