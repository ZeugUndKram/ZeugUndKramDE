// Die 12 Tueren des Zeugzember. Fertige Tueren bekommen eine `to`-Route,
// alles ohne `to` rendert automatisch als "kommt noch".

export interface Door {
  day: number
  title: string
  note: string
  to?: string
}

export const DOORS: Door[] = [
  { day: 1, title: 'ESC Discovery', note: 'Alle deutschen Beiträge seit 1956', to: '/zeugzember/esc' },
  { day: 2, title: 'Jamba Ranker', note: 'Klingeltöne im Duell', to: '/zeugzember/jamba' },
  { day: 3, title: 'Internet-Zeitmaschine', note: 'Das Web, wie es mal aussah', to: '/zeugzember/oldweb' },
  { day: 4, title: 'Leberkässushi', note: 'Kochen auf Zeit', to: '/leberkäsesushi' },
  { day: 5, title: '', note: '' },
  { day: 6, title: '', note: '' },
  { day: 7, title: 'Game Demakes', note: 'Original gegen GBA-Portierung', to: '/zeugzember/demakes' },
  { day: 8, title: '', note: '' },
  { day: 9, title: '', note: '' },
  { day: 10, title: '', note: '' },
  { day: 11, title: '', note: '' },
  { day: 12, title: '', note: '' },
]

export const openDoors = DOORS.filter((door) => door.to).length
