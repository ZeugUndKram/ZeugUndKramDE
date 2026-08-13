// Geometrie von Schritt 6 (Teig flach drücken), in SVG-Einheiten 0..100.
// Der Teigballen liegt in der Mitte und ist in gleich große Sektoren geteilt.
// Jeder Sektor wird einmal von der Mitte nach außen gedrückt und gibt dabei
// nach. Gezeichnet wird das in PressTask.vue.

import { toPathD, type Vec } from './shapes'

export const CENTER: Vec = { x: 50, y: 54 }

/** Radius eines Sektors, solange der Teig dort noch Kugel ist */
export const R_BALL = 15
/** Radius eines flachgedrückten Sektors */
export const R_FLAT = 30
/** So nah an der Mitte muss ein Druck ansetzen */
export const START_RADIUS = 11
/** So weit nach außen muss er gehen, damit der Teig nachgibt */
export const PUSH_DISTANCE = 26

const TAU = Math.PI * 2

export const distance = (a: Vec, b: Vec): number => Math.hypot(a.x - b.x, a.y - b.y)

export const angleOf = (p: Vec): number => Math.atan2(p.y - CENTER.y, p.x - CENTER.x)

const norm = (angle: number) => ((angle % TAU) + TAU) % TAU

/** In welchem Sektor ein Winkel liegt */
export const sectorAt = (angle: number, count: number): number =>
  Math.floor(norm(angle) / (TAU / count)) % count

/** Winkel der Sektormitte — dorthin zeigt der Hinweispfeil */
export const sectorAngle = (index: number, count: number): number =>
  (index + 0.5) * (TAU / count)

export const pointAt = (angle: number, radius: number): Vec => ({
  x: CENTER.x + Math.cos(angle) * radius,
  y: CENTER.y + Math.sin(angle) * radius,
})

/**
 * Radius des Teigrands an einem Winkel. Zwischen zwei Sektormitten wird weich
 * überblendet: gedrückte und ungedrückte Sektoren gehen so ineinander über,
 * statt eine Zacke zu bilden — Teig hat keine Kanten.
 */
export const radiusAt = (radii: readonly number[], angle: number): number => {
  const count = radii.length
  const t = norm(angle) / (TAU / count) - 0.5
  const i = Math.floor(t)
  const f = t - i
  const a = radii[((i % count) + count) % count]!
  const b = radii[(((i + 1) % count) + count) % count]!
  // Smoothstep statt linear, damit der Übergang an den Sektormitten flach ausläuft.
  return a + (b - a) * f * f * (3 - 2 * f)
}

/** Geschlossener Umriss des Teigs als SVG-`d`-Attribut */
export const outlineD = (radii: readonly number[], samples = 96): string => {
  const points: Vec[] = []
  for (let i = 0; i < samples; i++) {
    const angle = (i / samples) * TAU
    points.push(pointAt(angle, radiusAt(radii, angle)))
  }
  return `${toPathD(points)} Z`
}
