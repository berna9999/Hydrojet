// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// URL canonico: SITE_URL esplicito, altrimenti il dominio di produzione Vercel.
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/richiesta-inviata'),
    }),
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      QUOTE_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      QUOTE_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'HydroJet <onboarding@resend.dev>',
      }),
    },
  },
  image: {
    layout: 'constrained',
  },
});
