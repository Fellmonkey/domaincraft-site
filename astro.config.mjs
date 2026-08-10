// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://domaincraft.github.io',
  base: '/domaincraft-site/',
  integrations: [
    react(),
    sitemap({
      // /studio и /ru/studio — полноэкранные iframe-страницы без индексируемого контента
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/studio/' && path !== '/ru/studio/';
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 4444
  },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false
    }
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});