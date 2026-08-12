// Zentrale Liste aller Social-Links. Wird von Socials.vue und Footer.vue genutzt,
// damit ein neuer Link nur an einer Stelle eingetragen werden muss.

export interface SocialLink {
  /** Kurzname, dient gleichzeitig als CSS-Hook fuer die Akzentfarbe */
  key: 'youtube' | 'tiktok' | 'tindie'
  label: string
  /** Was einen dort erwartet, ein Satz */
  note: string
  url: string
  /** SVG-Pfad, 24x24 Viewbox */
  icon: string
}

export const SOCIALS: SocialLink[] = [
  {
    key: 'youtube',
    label: 'YouTube',
    note: 'Videos zu dem, was hier rumliegt',
    url: 'https://youtube.com/@yourchannel',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    note: 'Dasselbe, nur hochkant',
    url: 'https://tiktok.com/@yourhandle',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.43-.2-3.41.49-.9.63-1.37 1.75-1.27 2.85.01.92.5 1.82 1.25 2.36.93.7 2.19.79 3.25.46 1.05-.33 1.93-1.21 2.21-2.29.18-.58.21-1.18.21-1.78-.03-3.66-.01-7.32-.03-10.98z',
  },
  {
    key: 'tindie',
    label: 'Tindie',
    note: 'Platinen, die ich zu viel bestellt habe',
    url: 'https://tindie.com/stores/yourstore',
    icon: 'M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45zM11 15h2v2h-2v-2zm0-7h2v5h-2V8z',
  },
]
