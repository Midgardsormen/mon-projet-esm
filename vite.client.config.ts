import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-client',
    rollupOptions: {
      input: {
        'client-main': path.resolve(__dirname, 'views/client-main.js'),
        'client-home': path.resolve(__dirname, 'views/components/home/statics/client-home.js')
      },
    },
    manifest: true,
  },
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true,
      },
    }),
  ],
});
