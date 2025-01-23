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
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true,
      },
        // <-- Ici on indique à la plugin Svelte d'utiliser svelte-preprocess
        preprocess: sveltePreprocess({
          scss: {
            // Ici tu peux configurer des options pour SCSS,
            // par exemple ajouter des variables globales
            // prependData: `@import 'src/styles/variables.scss';`
          },
          // Si tu utilises TypeScript dans tes Svelte Components :
          typescript: true,
        }),
    }),
  ],
});
