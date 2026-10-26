# HydroJet — sito web

Sito di HydroJet, pulizia con idropulitrice a Pesaro e Cattolica.
Realizzato con [Astro](https://astro.build) e pubblicato su [Vercel](https://vercel.com).

- Pagine statiche (veloci, ottime per la SEO) + una funzione server per il modulo preventivo.
- Nessun cookie, nessun tracciamento, font ospitati sul sito.
- Contenuti onesti: niente recensioni, numeri o servizi non confermati.

## Avvio in locale

Requisiti: Node.js 22.12 o successivo.

```bash
npm install
npm run dev
```

Il sito è su http://localhost:4321.

| Comando           | Cosa fa                                           |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Server di sviluppo con ricarica automatica        |
| `npm run build`   | Build di produzione (output per Vercel)           |
| `npm run check`   | Controllo di tipi e template (TypeScript + Astro) |

## Dove si modificano i contenuti

| Cosa                                         | File                                   |
| -------------------------------------------- | -------------------------------------- |
| Telefono, WhatsApp, email, social, P. IVA    | `src/config/site.ts`                   |
| Zona di lavoro                               | `src/config/site.ts` (`areas`)         |
| Servizi                                      | `src/data/services.ts`                 |
| Lavori prima/dopo (portfolio)                | `src/data/projects.ts` + `src/assets/lavori/` |
| Voci del menu                                | `src/data/navigation.ts`               |
| Testi delle sezioni                          | `src/components/*.astro`               |
| Colori, font, spaziature                     | `src/styles/global.css`                |

I campi lasciati vuoti in `site.ts` **non vengono mostrati**: appena inserisci un
numero WhatsApp, ad esempio, compaiono automaticamente i pulsanti WhatsApp
(hero, contatti, barra mobile, footer) e il dato entra nei dati strutturati SEO.

### Aggiungere un lavoro prima/dopo

1. Copia le due foto originali in `src/assets/lavori/` (JPG o PNG, senza ritocchi).
2. In `src/data/projects.ts` importale e aggiungi un oggetto all'array `projects`
   con titolo, superficie, descrizione e testi alternativi.
3. Le immagini vengono ottimizzate automaticamente (AVIF/WebP, più dimensioni).

### Logo, favicon e anteprima social

Il simbolo del logo è un SVG (`src/assets/brand/hydrojet-mark.svg`) ricavato
dal logo originale (`src/assets/brand/logo-originale.jpg`). Favicon, icone e
immagine Open Graph si rigenerano con:

```bash
node scripts/generate-brand-assets.mjs
```

## Modulo preventivo

Il modulo invia la richiesta a `/api/preventivo` (funzione server su Vercel),
che la inoltra via email con [Resend](https://resend.com) (piano gratuito).
Se le variabili non sono configurate, il sito mostra un messaggio d'errore
chiaro: **non finge mai un invio riuscito**.

Variabili d'ambiente (vedi `.env.example`), da impostare su Vercel in
*Project → Settings → Environment Variables*:

| Variabile          | Valore                                                        |
| ------------------ | ------------------------------------------------------------- |
| `RESEND_API_KEY`   | Chiave API creata su resend.com                               |
| `QUOTE_TO_EMAIL`   | Email su cui ricevere le richieste (anche più, separate da virgola) |
| `QUOTE_FROM_EMAIL` | Mittente. Senza dominio verificato: `HydroJet <onboarding@resend.dev>` |
| `SITE_URL`         | (facoltativo) dominio definitivo, es. `https://www.hydrojet.it` |

> Con il mittente `onboarding@resend.dev` Resend consegna solo all'email con cui
> è stato creato l'account Resend. Per inviare a un altro indirizzo, verifica un
> dominio su Resend e usa un mittente di quel dominio.

Protezioni incluse: validazione lato client e server con gli stessi messaggi,
campo antispam nascosto, controllo del tempo di compilazione, limite di
dimensione della richiesta. Funziona anche con JavaScript disattivato.

## Pubblicazione su Vercel tramite GitHub

1. Crea un repository su GitHub e carica questo progetto.
2. Su vercel.com: *Add New → Project → Import* il repository.
   Il framework (Astro) viene rilevato da solo, non servono impostazioni di build.
3. Aggiungi le variabili d'ambiente del modulo e fai *Redeploy*.
4. (Facoltativo) collega un dominio in *Settings → Domains* e imposta `SITE_URL`.

Ogni `git push` sul ramo principale pubblica automaticamente una nuova versione.

## Note legali

L'informativa privacy (`src/pages/privacy.astro`) descrive il funzionamento
reale del sito, ma va verificata da HydroJet (idealmente con un professionista)
e completata con i dati del titolare in `src/config/site.ts` (`legal`).
