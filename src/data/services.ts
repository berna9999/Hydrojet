/**
 * Servizi presentati sul sito.
 *
 * Pubblica qui SOLO i servizi confermati da HydroJet. Per aggiungerne uno,
 * aggiungi un oggetto all'array: la sezione "Servizi" si aggiorna da sola.
 * `projectId` collega il servizio a un lavoro documentato in projects.ts
 * (la card mostra la foto reale); `icon` è un nome definito in Icon.astro.
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'brick-wall' | 'route' | 'sun' | 'grid' | 'sprout';
  projectId?: string;
}

export const services: Service[] = [
  {
    id: 'muri-esterni',
    title: 'Muri esterni',
    description:
      'Rimozione di sporco, incrostazioni, colature e aloni scuri da muri esterni e muri di contenimento.',
    icon: 'brick-wall',
    projectId: 'muro-cemento',
  },
  {
    id: 'vialetti',
    title: 'Vialetti',
    description: 'Vialetti e camminamenti liberati da sporco e incrostazioni accumulati nel tempo.',
    icon: 'route',
  },
  {
    id: 'patio',
    title: 'Patio',
    description: 'Pulizia del patio e delle superfici esterne vicino a casa, da vivere di nuovo.',
    icon: 'sun',
  },
  {
    id: 'pavimentazioni',
    title: 'Pavimentazioni',
    description: 'Pavimentazioni esterne ripulite da sporco, macchie e incrostazioni.',
    icon: 'grid',
  },
  {
    id: 'giardini',
    title: 'Giardini',
    description: 'Pulizia delle superfici esterne del giardino, per riportarle in ordine.',
    icon: 'sprout',
  },
];
