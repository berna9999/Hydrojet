/**
 * Riceve le richieste di preventivo e le inoltra via email con Resend.
 *
 * Variabili d'ambiente (vedi .env.example): RESEND_API_KEY, QUOTE_TO_EMAIL,
 * QUOTE_FROM_EMAIL. Se mancano, l'endpoint risponde 503 e il sito mostra un
 * errore onesto invece di fingere un invio riuscito.
 */
import type { APIRoute } from 'astro';
import { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } from 'astro:env/server';
import { readQuote, validateQuote, type FieldErrors, type QuoteInput } from '../../lib/quote';

export const prerender = false;

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2500;

interface Result {
  status: number;
  ok: boolean;
  message?: string;
  errors?: FieldErrors;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function buildEmail(quote: QuoteInput) {
  const rows: [string, string][] = [
    ['Nome', quote.name],
    ['Telefono', quote.phone || '—'],
    ['Email', quote.email || '—'],
    ['Località', quote.area],
  ];
  const text = [
    'Nuova richiesta di preventivo dal sito HydroJet',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Lavoro da fare:',
    quote.message,
  ].join('\n');
  const html = `
    <h2 style="font-family:sans-serif">Nuova richiesta di preventivo</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#566778">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
        )
        .join('')}
    </table>
    <h3 style="font-family:sans-serif">Lavoro da fare</h3>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(quote.message)}</p>`;
  return { text, html };
}

async function handle(request: Request): Promise<Result> {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) {
    return { status: 413, ok: false, message: 'La richiesta è troppo lunga.' };
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return { status: 400, ok: false, message: 'Dati del modulo non validi.' };
  }

  // Antispam: campo nascosto compilato o invio troppo rapido = bot. Nessuna email.
  const startedAt = Number(data.get('started_at'));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
  if (data.get('website') || tooFast) {
    return { status: 200, ok: true };
  }

  const quote = readQuote(data);
  const errors = validateQuote(quote);
  if (Object.keys(errors).length > 0) {
    return { status: 422, ok: false, message: 'Controlla i campi evidenziati.', errors };
  }

  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL) {
    console.error('[preventivo] RESEND_API_KEY o QUOTE_TO_EMAIL non configurate.');
    return {
      status: 503,
      ok: false,
      message: 'Il modulo non è ancora attivo, quindi la richiesta non è stata inviata.',
    };
  }

  const { text, html } = buildEmail(quote);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: QUOTE_FROM_EMAIL || 'HydroJet <onboarding@resend.dev>',
        to: QUOTE_TO_EMAIL.split(',').map((address) => address.trim()),
        reply_to: quote.email || undefined,
        subject: `Richiesta preventivo — ${quote.name} (${quote.area})`,
        text,
        html,
      }),
    });

    if (!response.ok) {
      console.error('[preventivo] Errore Resend', response.status, await response.text());
      return { status: 502, ok: false, message: 'Non siamo riusciti a inviare la richiesta.' };
    }
  } catch (error) {
    console.error('[preventivo] Invio fallito', error);
    return { status: 502, ok: false, message: 'Non siamo riusciti a inviare la richiesta.' };
  }

  return { status: 200, ok: true };
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const result = await handle(request);
  const wantsJson = request.headers.get('accept')?.includes('application/json');

  if (wantsJson) {
    return new Response(JSON.stringify(result), {
      status: result.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  // Fallback senza JavaScript: pagina di conferma o pagina d'errore minimale.
  if (result.ok) return redirect('/richiesta-inviata', 303);

  const details = result.errors ? Object.values(result.errors) : [];
  const body = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Richiesta non inviata — HydroJet</title></head>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;line-height:1.6;color:#0c1a28">
<h1>Richiesta non inviata</h1><p>${escapeHtml(result.message ?? 'Si è verificato un errore.')}</p>
${details.length ? `<ul>${details.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
<p><a href="/#preventivo">Torna al modulo</a></p></body></html>`;
  return new Response(body, {
    status: result.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
