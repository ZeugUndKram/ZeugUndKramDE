// Das Rezept als Daten. Ein neuer Schritt braucht hier einen Eintrag und in
// LeberkaeseSushi.vue einen Eintrag in der TASKS-Map auf seine Task-Komponente.

export type TaskKind =
  | 'pour'
  | 'stir'
  | 'foil'
  | 'fill'
  | 'oven'
  | 'press'
  | 'paint'
  | 'wrap'
  | 'cut'

export interface RecipeStep {
  id: string
  /** Überschrift auf der Ankündigungskarte und im HUD */
  title: string
  /** Was der Spieler tun soll, ein bis zwei Sätze */
  brief: string
  /** Sekunden, die der Schritt Zeit lässt */
  timeLimit: number
  task: TaskKind
  /** Wie viele Teilaufgaben zu schaffen sind */
  goal: number
  /**
   * Zusätzliche Props für die Task-Komponente. Damit lässt sich dieselbe
   * Aufgabe zweimal verwenden und trotzdem das Richtige zeigen — der zweite
   * Ofengang backt schließlich nicht mehr dasselbe wie der erste.
   */
  props?: Record<string, unknown>
}

export const RECIPE: RecipeStep[] = [
  {
    id: 'teig-zutaten',
    title: 'Teig ansetzen',
    brief: 'Zieh die Schüsseln in die große Schüssel — in der Reihenfolge, die oben steht.',
    timeLimit: 30,
    task: 'pour',
    goal: 6,
  },
  {
    id: 'teig-ruehren',
    title: 'Teig verrühren',
    brief:
      'Fahr die Form über der Schüssel nach — fünf Stück. Greifst du einem Punkt vor, geht die Form von vorne los.',
    timeLimit: 30,
    task: 'stir',
    goal: 5,
  },
  {
    id: 'form-alufolie',
    title: 'Form bauen',
    brief:
      'Zwei Aktionen: Alufolie von beiden Seiten an den Zylinder drücken und ihn herausziehen, dann die Rolle hochkant durchschneiden.',
    timeLimit: 45,
    task: 'foil',
    goal: 2,
  },
  {
    id: 'form-fuellen',
    title: 'Form füllen',
    brief: 'Hol Brät aus der Schüssel und setz es in die Form — fünf Stellen, bis sie voll ist.',
    timeLimit: 30,
    task: 'fill',
    goal: 5,
  },
  {
    id: 'ofen-hitze',
    title: 'Ab in den Ofen',
    brief:
      'Drück den Knopf am Ofen: Der Zeiger läuft los und wird schneller, je näher er an Grün kommt. Der zweite Druck stoppt ihn — so nah an der Marke wie möglich.',
    timeLimit: 25,
    task: 'oven',
    goal: 1,
  },
  {
    id: 'teig-flachdruecken',
    title: 'Teig flach drücken',
    brief:
      'Der Teig kommt als Kugel auf die Arbeitsfläche. Setz in der Mitte an und drück ihn nach außen — einmal in jede Richtung, bis er rundum flach ist.',
    timeLimit: 30,
    task: 'press',
    goal: 8,
  },
  {
    id: 'senf-bestreichen',
    title: 'Süßen Senf aufstreichen',
    brief:
      'Tunk den Pinsel in die Schüssel und streich den Zylinder rundum ein — keine Stelle darf trocken bleiben. Ist der Pinsel leer, holst du neuen Senf.',
    timeLimit: 35,
    task: 'paint',
    goal: 5,
  },
  {
    id: 'teig-wickeln',
    title: 'Teig umwickeln',
    brief:
      'Der Zylinder liegt auf dem ausgerollten Teigfladen. Zieh den Rand von beiden Seiten über ihn — Lappen für Lappen, jeweils bis über die Mitte, sonst schnappt er zurück.',
    timeLimit: 30,
    task: 'wrap',
    goal: 6,
  },
  {
    id: 'ofen-fertig',
    title: 'Nochmal in den Ofen',
    brief:
      'Der eingewickelte Zylinder kommt zurück in den Ofen. Gleiches Spiel wie beim Vorheizen: Knopf drücken, Zeiger laufen lassen, in Grün stoppen.',
    timeLimit: 25,
    task: 'oven',
    goal: 1,
    props: { content: 'wrapped' },
  },
  {
    id: 'sushi-schneiden',
    title: 'In Sushistücke schneiden',
    brief:
      'Schneid die Rolle an der Linie durch — von oben ansetzen und ganz durchziehen. Jedes Stück kommt danach auf einen freien Platz im Kreis auf dem Teller.',
    timeLimit: 40,
    task: 'cut',
    goal: 6,
  },
]

/** Der Schritt, dessen Ergebnis auf dem Abschlussbild landet */
export const FINAL_STEP_ID = 'sushi-schneiden'

export const INGREDIENTS = [
  { id: 'mehl', label: 'Mehl', color: '#e8e0cf' },
  { id: 'wasser', label: 'Wasser', color: '#7fb5d5' },
  { id: 'hefe', label: 'Hefe', color: '#d9b382' },
  { id: 'salz', label: 'Salz', color: '#f2f2f2' },
  { id: 'zucker', label: 'Zucker', color: '#dcd6e8' },
  { id: 'butter', label: 'Butter', color: '#f0d878' },
]
