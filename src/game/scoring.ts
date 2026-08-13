// Bewertung im Cooking-Mama-Sinn: Wie viel geschafft, wie sauber, wie schnell.

export interface StepResult {
  id: string
  title: string
  /** Geschaffte Teilaufgaben */
  done: number
  goal: number
  /** 0..1, wie sauber gearbeitet wurde */
  accuracy: number
  timeUsed: number
  timeLimit: number
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** Gewichtung: Vollständigkeit zählt am meisten, Tempo am wenigsten. */
export const stepScore = (r: StepResult): number => {
  const completion = r.goal === 0 ? 0 : clamp01(r.done / r.goal)
  const speed = clamp01(1 - r.timeUsed / r.timeLimit)
  // Tempo zählt nur, was auch fertig geworden ist — sonst lohnt sich Aufgeben.
  return Math.round(1000 * (0.55 * completion + 0.3 * completion * r.accuracy + 0.15 * completion * speed))
}

export const MAX_STEP_SCORE = 1000

export interface Verdict {
  points: number
  max: number
  ratio: number
  medal: 'gold' | 'silber' | 'bronze' | 'roh'
  title: string
  note: string
}

export const verdictFor = (results: StepResult[]): Verdict => {
  const points = results.reduce((sum, r) => sum + stepScore(r), 0)
  const max = results.length * MAX_STEP_SCORE
  const ratio = max === 0 ? 0 : points / max

  if (ratio >= 0.9) {
    return { points, max, ratio, medal: 'gold', title: 'Gold', note: 'Mama ist beeindruckt.' }
  }
  if (ratio >= 0.7) {
    return { points, max, ratio, medal: 'silber', title: 'Silber', note: 'Sauber gearbeitet, geht aber flotter.' }
  }
  if (ratio >= 0.45) {
    return { points, max, ratio, medal: 'bronze', title: 'Bronze', note: 'Essbar. Gerade so.' }
  }
  return { points, max, ratio, medal: 'roh', title: 'Roh', note: 'Das war eher eine Sauerei als ein Teig.' }
}
