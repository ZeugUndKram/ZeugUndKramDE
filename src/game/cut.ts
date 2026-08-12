// Geometrie von Schritt 10 (In Stücke schneiden), in SVG-Einheiten 0..100.
// Links liegt die gebackene Rolle auf dem Brett, rechts der Teller. Jedes Stück
// wird erst abgeschnitten und dann auf einen der Plätze im Kreis gelegt.
// Gezeichnet wird das in CutTask.vue.

import type { Vec } from './shapes'

/** Die gebackene Rolle auf dem Schneidebrett */
export const ROLL = { left: 8, right: 50, top: 33, bottom: 45 }

/** Halbmesser eines Sushistücks */
export const SLICE_R = 6

/** Der Teller */
export const PLATE = { x: 74, y: 52, r: 21 }
/** Auf diesem Kreis liegen die Stücke */
export const RING_R = 13

/** Wo ein frisch abgeschnittenes Stück liegen bleibt */
export const LOOSE_Y = ROLL.bottom + 11

/** So genau muss der Schnitt an der Linie bleiben */
export const CUT_TOLERANCE = 4.5
/** So nah muss ein Stück an seinem Platz landen */
export const DROP_RADIUS = 8

export const pieceWidth = (count: number): number => (ROLL.right - ROLL.left) / count

/** Die Plätze auf dem Teller, gleichmäßig im Kreis, oben beginnend */
export const buildSlots = (count: number): Vec[] =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return {
      x: PLATE.x + Math.cos(angle) * RING_R,
      y: PLATE.y + Math.sin(angle) * RING_R,
    }
  })

/**
 * Nächstgelegener noch freier Platz in Reichweite, sonst -1.
 * Wie beim Formfüllen: bewusst der nächste *freie*, damit ein Stück zwischen
 * zwei Plätzen nicht ins Leere fällt.
 */
export const nearestFreeSlot = (
  p: Vec,
  slots: readonly Vec[],
  taken: readonly boolean[],
): number => {
  let best = -1
  let bestDistance = DROP_RADIUS
  slots.forEach((slot, i) => {
    if (taken[i]) return
    const distance = Math.hypot(p.x - slot.x, p.y - slot.y)
    if (distance <= bestDistance) {
      bestDistance = distance
      best = i
    }
  })
  return best
}
