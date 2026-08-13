// Geometrie von Schritt 4 (Form füllen), in SVG-Einheiten 0..100.
// Die Alufolienform steht in der Mitte, die Schüssel mit dem Brät links daneben.

import type { Vec } from './shapes'

export const BOWL = { x: 14, y: 60, r: 13 }

export const FORM = { left: 30, right: 86, top: 36, bottom: 60 }

/** Die fünf Stellen, die gefüllt werden müssen */
export const SPOTS: Vec[] = [37, 48, 59, 70, 81].map((x) => ({ x, y: 48 }))

export const SPOT_RADIUS = 5
/** Wie nah an einer Stelle losgelassen werden muss */
export const DROP_RADIUS = 8

export const isInBowl = (p: Vec): boolean => Math.hypot(p.x - BOWL.x, p.y - BOWL.y) <= BOWL.r

/**
 * Nächstgelegene noch freie Stelle in Reichweite, sonst -1.
 *
 * Bewusst die nächste *freie*: liegt man zwischen einer vollen und einer leeren
 * Stelle, landet der Löffel in der leeren statt ins Leere zu gehen. Genau auf
 * eine volle Stelle gesetzt ist dagegen ein Fehlgriff — die nächste freie liegt
 * dann außer Reichweite, und das soll auch so sein.
 */
export const nearestFreeSpot = (p: Vec, filled: readonly boolean[]): number => {
  let best = -1
  let bestDistance = DROP_RADIUS
  SPOTS.forEach((spot, i) => {
    if (filled[i]) return
    const distance = Math.hypot(p.x - spot.x, p.y - spot.y)
    if (distance <= bestDistance) {
      bestDistance = distance
      best = i
    }
  })
  return best
}
