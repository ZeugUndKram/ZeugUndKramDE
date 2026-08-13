// Geometrie von Schritt 8 (Teig umwickeln), in SVG-Einheiten 0..100.
// Draufsicht: der Brätzylinder liegt quer auf dem runden Teigfladen aus
// Schritt 6 — gleicher Radius wie dort, damit es derselbe Teig bleibt. Der
// Rand neben dem Zylinder ist in Lappen geteilt, die einzeln über ihn gezogen
// werden. Was übergezogen ist, fehlt außen. Gezeichnet wird in WrapTask.vue.

import type { Vec } from './shapes'
import { R_FLAT } from './press'

/** Der ausgerollte Teigfladen */
export const DOUGH = { x: 50, y: 50, r: R_FLAT }

const DISC_TOP = DOUGH.y - DOUGH.r
const DISC_BOTTOM = DOUGH.y + DOUGH.r

/** Der Zylinder, von oben gesehen — liegt quer über dem Fladen */
export const ROLL = { left: 22, right: 78, top: 41, bottom: 59 }

/** So tief ist der Teigrand neben dem Zylinder */
export const FLAP_DEPTH = ROLL.top - DISC_TOP

/**
 * Wie weit ein Lappen über die Zylinderkante hinaus muss, damit er hält.
 * Etwas mehr als die halbe Breite: die Lagen von oben und unten überlappen
 * sich in der Mitte, sonst klafft die Naht auf.
 */
export const COVER_DEPTH = (ROLL.bottom - ROLL.top) * 0.62

export type Side = 'top' | 'bottom'

export interface Flap {
  side: Side
  /** Abschnitt des Zylinders, den dieser Lappen abdeckt */
  left: number
  right: number
}

/** Teilt den Teigrand in `count` Lappen auf, je zur Hälfte oben und unten. */
export const buildFlaps = (count: number): Flap[] => {
  const perSide = Math.max(1, Math.round(count / 2))
  const width = (ROLL.right - ROLL.left) / perSide
  const flaps: Flap[] = []

  for (const side of ['top', 'bottom'] as Side[]) {
    for (let i = 0; i < perSide; i++) {
      flaps.push({
        side,
        left: ROLL.left + i * width,
        right: ROLL.left + (i + 1) * width,
      })
    }
  }
  return flaps
}

const isOnDough = (p: Vec) => Math.hypot(p.x - DOUGH.x, p.y - DOUGH.y) <= DOUGH.r

/**
 * Der Lappen unter einem Punkt, sonst -1.
 *
 * Angefasst wird der Teig neben dem Zylinder, nicht der Zylinder selbst — die
 * Greifzone reicht deshalb vom Fladenrand bis knapp über die Zylinderkante.
 */
export const flapAt = (p: Vec, flaps: readonly Flap[]): number => {
  if (!isOnDough(p)) return -1
  return flaps.findIndex((flap) => {
    if (p.x < flap.left || p.x > flap.right) return false
    return flap.side === 'top' ? p.y <= ROLL.top + 2 : p.y >= ROLL.bottom - 2
  })
}

/** Wie weit ein Lappen bei dieser Zeigerposition übergezogen wäre, 0..1 */
export const foldFor = (flap: Flap, p: Vec): number => {
  const depth = flap.side === 'top' ? p.y - ROLL.top : ROLL.bottom - p.y
  return Math.max(0, Math.min(1, depth / COVER_DEPTH))
}

/** Kante des übergezogenen Teils auf dem Zylinder, in y */
export const foldEdge = (flap: Flap, fold: number): number =>
  flap.side === 'top' ? ROLL.top + fold * COVER_DEPTH : ROLL.bottom - fold * COVER_DEPTH

/**
 * Äußere Kante des Teigs, der neben dem Zylinder noch liegt.
 *
 * Wandert beim Ziehen nach innen: der Teig kommt nicht aus dem Nichts, er wird
 * vom Rand geholt. Bei fold = 1 ist neben dem Zylinder nichts mehr übrig.
 */
export const outerEdge = (flap: Flap, fold: number): number =>
  flap.side === 'top'
    ? DISC_TOP + fold * FLAP_DEPTH
    : DISC_BOTTOM - fold * FLAP_DEPTH
