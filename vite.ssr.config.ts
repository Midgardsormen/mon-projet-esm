import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  // Mode SSR
  build: {
    outDir: 'dist-ssr', // dossier de build SSR
    ssr: true,
    rollupOptions: {
      input: {
        'ssr-main' : path.resolve(__dirname, 'views/ssr-main.js'),
        'ssr-home': path.resolve(__dirname, 'views/components/home/statics/ssr-home.js')
      }, // point d'entrée SSR
      output: {
        format: 'cjs', // ou ESM selon besoin
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true,
      },
      emitCss: true, // pour extraire le CSS
    }),
  ],
});
