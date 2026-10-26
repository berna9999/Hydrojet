import type { ImageMetadata } from 'astro';
import muroPrima from '../assets/lavori/muro-cemento-prima.jpg';
import muroDopo from '../assets/lavori/muro-cemento-dopo.jpg';

/**
 * Lavori reali documentati con foto prima/dopo.
 *
 * Per aggiungere un lavoro: copia le due foto originali in src/assets/lavori/,
 * importale qui sopra e aggiungi un oggetto all'array. Descrivi solo ciò che
 * le foto mostrano, senza tempi, prodotti o risultati non documentati.
 */
export interface Project {
  id: string;
  title: string;
  /** Tipo di superficie, mostrato come etichetta. */
  surface: string;
  description: string;
  /** Nota facoltativa sulle foto (es. inquadrature diverse). */
  photoNote?: string;
  before: { src: ImageMetadata; alt: string };
  after: { src: ImageMetadata; alt: string };
}

export const projects: Project[] = [
  {
    id: 'muro-cemento',
    title: 'Muro di contenimento in cemento',
    surface: 'Cemento a vista',
    description:
      'Pulizia con idropulitrice di un muro in cemento a vista segnato da colature, aloni scuri e sporco accumulato.',
    photoNote:
      'Le due foto sono state scattate da punti di vista diversi: per questo le mostriamo affiancate e non sovrapposte.',
    before: {
      src: muroPrima,
      alt: 'Muro in cemento prima della pulizia, con colature scure, macchie e sporco su tutta la superficie',
    },
    after: {
      src: muroDopo,
      alt: 'Lo stesso muro in cemento dopo la pulizia con idropulitrice, con la superficie uniforme e chiara',
    },
  },
];
