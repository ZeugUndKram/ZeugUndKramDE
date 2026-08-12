// Gemeinsamer Vertrag aller Aufgaben-Komponenten.
//
// Jede Task bekommt `goal` und `active` als Props und meldet sich per
// `update` (Zwischenstand) und `complete` (alles geschafft) zurueck.
// Die Zeit verwaltet die Spielhuelle, nicht die Task.

export interface TaskState {
  /** Wie viele Teilaufgaben geschafft sind */
  done: number
  /** 0..1, wie sauber gearbeitet wurde */
  accuracy: number
}
