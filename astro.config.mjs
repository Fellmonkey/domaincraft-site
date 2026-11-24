// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://fellmonkey.github.io',
  base: '/domaincraft-site/',
  integrations: [
    react(),
    sitemap({
      // /studio и /ru/studio — полноэкранные iframe-страницы без индексируемого контента;
      // /ru/404/ — страница «не найдено», не должна индексироваться (корневой /404/ GitHub Pages
      // отдаёт спец-образом, и в sitemap он не попадает).
      // sitemap передаёт полный URL: pathname включает `base`. Снимаем base перед сравнением.
      filter: (page) => {
        const path = new URL(page).pathname.replace('/domaincraft-site', '');
        return !['/studio/', '/ru/studio/', '/ru/404/'].includes(path);
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