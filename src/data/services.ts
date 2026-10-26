/**
 * Servizi presentati sul sito.
 *
 * Pubblica qui SOLO i servizi confermati da HydroJet. Per aggiungerne uno,
 * aggiungi un oggetto all'array: la sezione "Servizi" si aggiorna da sola.
 * `projectId` collega il servizio a un lavoro documentato in projects.ts.
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  projectId?: string;
}

export const services: Service[] = [
  {
    id: 'muri-cemento',
    title: 'Muri e pareti in cemento',
    description:
      'Rimozione di sporco, colature e aloni scuri da muri di contenimento e pareti in cemento a vista.',
    projectId: 'muro-cemento',
  },
];
