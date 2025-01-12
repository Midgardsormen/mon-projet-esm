import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

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
    }),
  ],
});
