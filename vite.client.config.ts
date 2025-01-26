import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { sveltePreprocess } from 'svelte-preprocess';

export default defineConfig({
  build: {
    outDir: 'dist-client',
    rollupOptions: {
      input: path.resolve(__dirname, 'views/client-main.js'),
    },
    manifest: true,
  },
  // --- Ajout du bloc server ---
  server: {
    // Ici, tu peux changer le port si tu veux (par défaut: 5173)
    port: 5173,
    proxy: {
      // Lorsque le front appelle "/api/quelque-chose",
      // on redirige vers http://localhost:3000/quelque-chose
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Réécrit le chemin si tu ne veux pas garder le /api
        // Dans ce cas, si tu appelles /api/transactions,
        // ça devient http://localhost:3000/transactions
      },
    },
  },
  // --- Fin du bloc server ---
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true,
      },
      preprocess: sveltePreprocess({
        scss: {
          // Exemple : ajout de SCSS global
          // prependData: `@import 'src/styles/variables.scss';`
        },
        typescript: true,
      }),
    }),
  ],
});
