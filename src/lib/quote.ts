/**
 * Regole del modulo preventivo, condivise tra browser e server
 * così che i messaggi di errore siano sempre gli stessi.
 */
import { site } from '../config/site';

export interface QuoteInput {
  name: string;
  phone: string;
  email: string;
  area: string;
  message: string;
  privacy: boolean;
}

export type QuoteField = keyof QuoteInput | 'contact';
export type FieldErrors = Partial<Record<QuoteField, string>>;

export const LIMITS = {
  name: 80,
  phone: 25,
  email: 120,
  message: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s./()-]{6,}$/;

const text = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

export function readQuote(data: FormData): QuoteInput {
  return {
    name: text(data.get('name')),
    phone: text(data.get('phone')),
    email: text(data.get('email')),
    area: text(data.get('area')),
    message: text(data.get('message')),
    privacy: data.get('privacy') === 'on',
  };
}

export function validateQuote(input: QuoteInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.length < 2) errors.name = 'Scrivi il tuo nome.';
  else if (input.name.length > LIMITS.name) errors.name = 'Il nome è troppo lungo.';

  if (!input.phone && !input.email) {
    errors.contact = 'Lasciaci almeno un telefono o un’email per poterti rispondere.';
  }
  if (input.phone && (!PHONE_RE.test(input.phone) || input.phone.length > LIMITS.phone)) {
    errors.phone = 'Controlla il numero di telefono.';
  }
  if (input.email && (!EMAIL_RE.test(input.email) || input.email.length > LIMITS.email)) {
    errors.email = 'Controlla l’indirizzo email.';
  }

  if (!(site.areas as readonly string[]).includes(input.area)) {
    errors.area = 'Scegli dove si trova la superficie da pulire.';
  }

  if (input.message.length < 10) {
    errors.message = 'Descrivi in qualche parola cosa c’è da pulire.';
  } else if (input.message.length > LIMITS.message) {
    errors.message = `Il testo supera i ${LIMITS.message} caratteri.`;
  }

  if (!input.privacy) errors.privacy = 'Per inviare la richiesta conferma di aver letto l’informativa.';

  return errors;
}
