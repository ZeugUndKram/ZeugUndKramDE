// Geometrie und Toleranzen von Schritt 3 (Alufolie), in SVG-Einheiten 0..100.
// Getrennt von der Komponente, damit die Trefferzonen testbar bleiben.
//
// Seitenansicht: der Zylinder steht in der Mitte, die Folie liegt links und
// rechts daneben und wird von beiden Seiten angedrückt.

import { resample, type Vec } from './shapes'

export type Side = 'left' | 'right'

export const CYLINDER = { left: 40, right: 60, top: 20, bottom: 80 }

/** Die beiden Folienbahnen neben dem Zylinder */
export const FLAPS: Record<Side, { left: number; right: number }> = {
  left: { left: 10, right: CYLINDER.left },
  right: { left: CYLINDER.right, right: 90 },
}

export const FOIL_TOP = 20
export const FOIL_BOTTOM = 80

/** Höhe der Andrückstellen, gleich für beide Seiten */
const ROWS = [28, 41, 54, 67, 76]

export interface PressPoint extends Vec {
  side: Side
}

export const PRESS_POINTS: PressPoint[] = ROWS.flatMap((y): PressPoint[] => [
  { x: 25, y, side: 'left' },
  { x: 75, y, side: 'right' },
])

export const pointsOfSide = (side: Side) => PRESS_POINTS.filter((p) => p.side === side)

/** Liegt der Zeiger auf einer der beiden Folienbahnen? Zählt für die Genauigkeit. */
export const isOnFoil = (p: Vec): boolean => {
  if (p.y < FOIL_TOP || p.y > FOIL_BOTTOM) return false
  return (
    (p.x >= FLAPS.left.left && p.x <= FLAPS.left.right) ||
    (p.x >= FLAPS.right.left && p.x <= FLAPS.right.right)
  )
}

export const PRESS_RADIUS = 9

/** Wie weit der Zeiger nach oben muss, bis der Zylinder heraus ist */
export const PULL_DISTANCE = 28
/** So weit darf der Zylinder sichtbar herausrutschen */
export const PULL_LIMIT = 60

/** Hochkant: von oben nach unten mittig durch die Folienrolle. */
export const CUT_LINE: Vec[] = [
  { x: 50, y: 22 },
  { x: 50, y: 78 },
]

export const CUT_POINTS = resample(CUT_LINE, 5)

/** Muss kleiner sein als der Abstand zweier Schnittpunkte, sonst fallen zwei auf einmal */
export const CUT_HIT = 7
export const CUT_TOLERANCE = 10

/** Die zusammengedrückte Rolle, nachdem der Zylinder heraus ist */
export const TUBE = { left: 34, right: 66 }
