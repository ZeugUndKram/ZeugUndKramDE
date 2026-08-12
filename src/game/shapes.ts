// Formen, die beim Verrühren nachgefahren werden.
// Alle Koordinaten liegen im SVG-Koordinatenraum 0..100 (viewBox="0 0 100 100").

export interface Vec {
  x: number
  y: number
}

export interface Shape {
  id: string
  label: string
  /** Polylinie der Idealform, in Zeichenrichtung */
  points: Vec[]
}

const circle = (clockwise: boolean): Vec[] => {
  const points: Vec[] = []
  const steps = 48
  for (let i = 0; i <= steps; i++) {
    const angle = ((clockwise ? 1 : -1) * i * 2 * Math.PI) / steps - Math.PI / 2
    points.push({ x: 50 + Math.cos(angle) * 32, y: 50 + Math.sin(angle) * 32 })
  }
  return points
}

const wave = (): Vec[] => {
  const points: Vec[] = []
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    points.push({ x: 12 + t * 76, y: 50 - Math.sin(t * Math.PI * 4) * 26 })
  }
  return points
}

// Bogen nach unten, von links nach rechts
const arc = (): Vec[] => {
  const points: Vec[] = []
  const steps = 32
  for (let i = 0; i <= steps; i++) {
    const angle = Math.PI + (i / steps) * Math.PI
    points.push({ x: 50 + Math.cos(angle) * 34, y: 42 - Math.sin(angle) * 34 })
  }
  return points
}

// Formen duerfen sich nicht selbst kreuzen: an einem Kreuzungspunkt lagen zwei
// Checkpoints uebereinander, wodurch der erste Durchgang den Punkt des zweiten
// beruehrt und die Reihenfolge-Regel sofort zurueckgesetzt haette.

export const SHAPES: Shape[] = [
  { id: 'kreis-rechts', label: 'Kreis im Uhrzeigersinn', points: circle(true) },
  { id: 'kreis-links', label: 'Kreis gegen den Uhrzeigersinn', points: circle(false) },
  {
    id: 'zickzack',
    label: 'Zickzack',
    points: [
      { x: 14, y: 30 },
      { x: 32, y: 72 },
      { x: 50, y: 30 },
      { x: 68, y: 72 },
      { x: 86, y: 30 },
    ],
  },
  {
    id: 'dreieck',
    label: 'Dreieck',
    points: [
      { x: 50, y: 16 },
      { x: 84, y: 74 },
      { x: 16, y: 74 },
      { x: 50, y: 16 },
    ],
  },
  {
    id: 'quadrat',
    label: 'Quadrat',
    points: [
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 75, y: 75 },
      { x: 25, y: 75 },
      { x: 25, y: 25 },
    ],
  },
  { id: 'welle', label: 'Welle', points: wave() },
  { id: 'bogen', label: 'Bogen', points: arc() },
]

/** Kürzester Abstand von `p` zur Strecke a–b. */
export const distanceToSegment = (p: Vec, a: Vec, b: Vec): number => {
  const vx = b.x - a.x
  const vy = b.y - a.y
  const len2 = vx * vx + vy * vy
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2))
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy))
}

/** Kürzester Abstand von `p` zur gesamten Polylinie. Basis der Genauigkeitsmessung. */
export const distanceToPath = (p: Vec, points: Vec[]): number => {
  let min = Infinity
  for (let i = 0; i < points.length - 1; i++) {
    const d = distanceToSegment(p, points[i]!, points[i + 1]!)
    if (d < min) min = d
  }
  return min
}

/** Verteilt `count` Punkte gleichmäßig über die Bogenlänge — liefert die Checkpoints. */
export const resample = (points: Vec[], count: number): Vec[] => {
  const lengths: number[] = [0]
  let total = 0
  for (let i = 0; i < points.length - 1; i++) {
    total += Math.hypot(points[i + 1]!.x - points[i]!.x, points[i + 1]!.y - points[i]!.y)
    lengths.push(total)
  }

  const out: Vec[] = []
  for (let i = 0; i < count; i++) {
    const target = (total * (i + 1)) / count
    let seg = 1
    while (seg < lengths.length - 1 && lengths[seg]! < target) seg++
    const a = points[seg - 1]!
    const b = points[seg]!
    const segLen = lengths[seg]! - lengths[seg - 1]!
    const t = segLen === 0 ? 0 : (target - lengths[seg - 1]!) / segLen
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  }
  return out
}

/** Polylinie als SVG-`d`-Attribut. */
export const toPathD = (points: Vec[]): string =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')

const shuffled = (): Shape[] => {
  const pool = [...SHAPES]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool
}

/**
 * Zieht `count` Formen in zufälliger Reihenfolge. Sind mehr angefragt als es
 * Formen gibt, wird neu gemischt weitergezogen statt abgeschnitten.
 */
export const pickShapes = (count: number): Shape[] => {
  const out: Shape[] = []
  while (out.length < count) out.push(...shuffled().slice(0, count - out.length))
  return out
}
