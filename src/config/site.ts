/**
 * Dati aziendali di HydroJet.
 *
 * Questo è l'unico file da modificare per aggiornare recapiti e dati legali.
 * Ogni campo lasciato vuoto ('') NON viene mostrato sul sito: inserisci solo
 * informazioni reali e verificate.
 */
export const site = {
  name: 'HydroJet',
  /** Breve descrizione usata in meta description e anteprime social. */
  description:
    'HydroJet: pulizia con idropulitrice a Pesaro e Cattolica. Guarda un lavoro reale prima e dopo e richiedi un preventivo.',
  locale: 'it_IT',

  /** Zona di copertura: non aggiungere località non confermate. */
  areas: ['Pesaro', 'Cattolica'] as const,

  contact: {
    /**
     * Numeri di telefono in formato internazionale, es. '+39 333 123 4567'.
     * `whatsapp: true` mostra anche il pulsante WhatsApp per quel numero.
     */
    phones: [
      { number: '+39 333 400 0279', whatsapp: true },
      { number: '+39 351 809 2157', whatsapp: true },
    ] as { number: string; whatsapp?: boolean }[],
    /** Email pubblica, es. 'info@hydrojet.it'. */
    email: 'hydrojet026@gmail.com',
    /** URL completo del profilo Instagram, es. 'https://www.instagram.com/hydrojet'. */
    instagram: '',
    /** URL completo della pagina Facebook. */
    facebook: '',
  },

  /** Dati identificativi mostrati nel footer e nell'informativa privacy. */
  legal: {
    /** Ragione sociale o nome del titolare, es. 'HydroJet di Mario Rossi'. */
    companyName: '',
    /** Partita IVA, es. '01234567890'. */
    vatNumber: '',
    /** Sede legale. */
    address: '',
  },
};

export type Site = typeof site;

/** Rimuove spazi e simboli per costruire link tel: e wa.me. */
export const digitsOnly = (value: string) => value.replace(/[^\d+]/g, '');

const WHATSAPP_TEXT = 'Ciao HydroJet, vorrei un preventivo per una pulizia.';

/** Link wa.me con messaggio precompilato. */
export const whatsappLink = (number: string, text = WHATSAPP_TEXT) =>
  `https://wa.me/${digitsOnly(number).replace(/^\+/, '')}?text=${encodeURIComponent(text)}`;

/** Numeri pronti per i link: `href` per chiamare, `whatsapp` vuoto se non attivo. */
export const phones = site.contact.phones
  .filter((phone) => phone.number)
  .map((phone) => ({
    number: phone.number,
    href: `tel:${digitsOnly(phone.number)}`,
    whatsapp: phone.whatsapp ? whatsappLink(phone.number) : '',
  }));

/** Primo numero con WhatsApp, per i pulsanti singoli (es. barra su smartphone). */
export const mainWhatsapp = phones.find((phone) => phone.whatsapp)?.whatsapp ?? '';

export const hasDirectContact = Boolean(phones.length > 0 || site.contact.email);

/** Elenco leggibile delle zone, es. "Pesaro e Cattolica". */
export const areasLabel = new Intl.ListFormat('it', { style: 'long', type: 'conjunction' }).format(
  site.areas,
);
