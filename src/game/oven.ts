// Logik und Geometrie von Schritt 5 (Ab in den Ofen), in SVG-Einheiten 0..100.
// Der Zeiger laeuft auf der Anzeige von links (0) nach rechts (1). Wo die Zonen
// liegen und wie schnell er wird, steht hier — gezeichnet wird in OvenTask.vue.

import type { Vec } from './shapes'

/** Die Skala im Display des Bedienfelds */
export const BAR = { left: 20, right: 64, top: 24, bottom: 30 }

/** Der Startknopf am Bedienfeld */
export const BUTTON: Vec & { r: number } = { x: 79, y: 22, r: 6 }

/** Zonengrenzen als Anteil der Skala, 0 = ganz links, 1 = ganz rechts */
export const YELLOW_FROM = 0.45
export const GREEN_FROM = 0.72
/** Die Marke in Gruen, die die volle Wertung gibt */
export const PERFECT = 0.86

export type Zone = 'rot' | 'gelb' | 'gruen'

export const zoneAt = (x: number): Zone => {
  if (x >= GREEN_FROM) return 'gruen'
  if (x >= YELLOW_FROM) return 'gelb'
  return 'rot'
}

/** Anteil 0..1 auf die x-Koordinate der Skala */
export const barX = (x: number): number => BAR.left + x * (BAR.right - BAR.left)

// Tempo als Anteil pro Sekunde, quadratisch steigend: vorne laeuft der Zeiger
// gemuetlich an und wird erst kurz vor Gruen richtig schnell. Die ganze Skala
// dauert so knapp fuenf Sekunden, das gruene Stueck davon gut eine halbe.
const BASE_SPEED = 0.1
const RAMP = 0.55

export const speedAt = (x: number): number => BASE_SPEED + RAMP * x * x

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** 1 genau auf der Marke, 0 an den Raendern von Gruen */
export const precisionAt = (x: number): number => {
  const half = Math.max(PERFECT - GREEN_FROM, 1 - PERFECT)
  return clamp01(1 - Math.abs(x - PERFECT) / half)
}

/** Auch knapp in Gruen soll sich noch lohnen, nur eben deutlich weniger. */
const MIN_CREDIT = 0.4

export const creditFor = (precision: number): number =>
  MIN_CREDIT + (1 - MIN_CREDIT) * precision

/** Jeder Fehlversuch drueckt die Wertung, kostet aber nicht den ganzen Schritt. */
export const MISS_PENALTY = 0.75

export const ratingFor = (precision: number): string => {
  if (precision >= 0.85) return 'Perfekt!'
  if (precision >= 0.5) return 'Gut getroffen'
  return 'Knapp in Grün'
}

/** Anzeige-Temperatur zum Zeigerstand — reine Deko fuers Display. */
export const tempAt = (x: number): number => Math.round(50 + x * 250)
