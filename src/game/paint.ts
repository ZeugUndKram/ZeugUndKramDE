// Geometrie von Schritt 7 (Süßen Senf aufstreichen), in SVG-Einheiten 0..100.
// Der Brätzylinder liegt quer, die Senfschüssel darunter. Die Fläche ist in
// Bahnen und darin in Zellen geteilt: eine Zelle gilt als bestrichen, wenn der
// Pinsel nah genug an ihrer Mitte vorbeigezogen ist. Gezeichnet wird in
// PaintTask.vue — der gemalte Strich ist genau so breit wie der Trefferradius,
// damit Bild und Wertung dasselbe sagen.

import { distanceToSegment, type Vec } from './shapes'

export const LOAF = { left: 12, right: 88, top: 26, bottom: 56, rx: 7 }

export const BOWL = { x: 26, y: 80, r: 12 }

/** Halbe Pinselbreite — so weit deckt ein Strich nach beiden Seiten */
export const BRUSH_RADIUS = 6

/** Zellen je Bahn, quer und hoch */
const COLS_PER_STRIPE = 4
const ROWS = 4

/** Wie weit ein voller Pinsel reicht, in viewBox-Einheiten Weg */
export const BRUSH_RANGE = 70

export interface Cell extends Vec {
  /** Zu welcher Bahn die Zelle gehört */
  stripe: number
}

/** Mittelpunkte aller Zellen, aufgeteilt in `stripes` gleich breite Bahnen. */
export const buildCells = (stripes: number): Cell[] => {
  const cells: Cell[] = []
  const cols = stripes * COLS_PER_STRIPE
  const width = (LOAF.right - LOAF.left) / cols
  const height = (LOAF.bottom - LOAF.top) / ROWS

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < ROWS; row++) {
      cells.push({
        x: LOAF.left + (col + 0.5) * width,
        y: LOAF.top + (row + 0.5) * height,
        stripe: Math.floor(col / COLS_PER_STRIPE),
      })
    }
  }
  return cells
}

/** Linke Kante einer Bahn */
export const stripeX = (index: number, stripes: number): number =>
  LOAF.left + (index * (LOAF.right - LOAF.left)) / stripes

export const isInBowl = (p: Vec): boolean => Math.hypot(p.x - BOWL.x, p.y - BOWL.y) <= BOWL.r

/** Grob, ohne die abgerundeten Ecken — reicht, um Danebenmalen zu erkennen. */
export const isOnLoaf = (p: Vec): boolean =>
  p.x >= LOAF.left && p.x <= LOAF.right && p.y >= LOAF.top && p.y <= LOAF.bottom

/**
 * Indizes der Zellen, die ein Pinselzug von `a` nach `b` erwischt.
 *
 * Gegen die Strecke geprüft, nicht gegen den Endpunkt: ein schneller Strich
 * würde sonst zwischen zwei Messpunkten Zellen überspringen und Lücken lassen,
 * die auf dem Bild längst zugestrichen aussehen.
 */
export const cellsAlong = (cells: readonly Cell[], a: Vec, b: Vec): number[] => {
  const hit: number[] = []
  cells.forEach((cell, i) => {
    if (distanceToSegment(cell, a, b) <= BRUSH_RADIUS) hit.push(i)
  })
  return hit
}
