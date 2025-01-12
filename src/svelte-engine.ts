import { join } from 'path';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { toSnakeCase } from '../utils/format-string.js';

const myRequire = createRequire(import.meta.url);

let clientEntryFile = 'views/client-main.js'; // Valeur par défaut en cas d'échec
let cssFiles: string[] = [];

try {
  const manifestPath = join(process.cwd(), 'dist-client', '.vite', 'manifest.json');
  const manifestData = readFileSync(manifestPath, 'utf-8');
  const clientManifest = JSON.parse(manifestData);

  // Récupérer l'entrée pour "views/client-main.js"
  const manifestEntry = clientManifest["views/client-main.js"];
  if (manifestEntry) {
    clientEntryFile = manifestEntry.file || clientEntryFile;

    // Initialiser cssFiles avec les fichiers CSS directement associés à l'entrée s'ils existent
    if (manifestEntry.css) {
      cssFiles.push(...manifestEntry.css);
    }

    // Parcourir les modules importés pour collecter leurs CSS
    if (manifestEntry.imports && Array.isArray(manifestEntry.imports)) {
      manifestEntry.imports.forEach((imp: string) => {
        const dep = clientManifest[imp];
        if (dep && dep.css) {
          cssFiles.push(...dep.css);
        }
      });
    }
  }
} catch (e) {
  console.error('Erreur lors du chargement du manifest:', e);
}

export async function svelteTemplateEngine(
  filePath: string,
  options: any,
  next: Function,
) {
  const data = { ...options };
  delete data.settings;

  // Purger le cache en mode développement
  if (process.env.NODE_ENV !== 'production') {
    delete myRequire.cache[filePath];
  }

  const mod = myRequire(filePath);
  let Component = mod.default || mod;

  // Vérifier que le composant a bien une méthode render
  if (typeof Component.render !== 'function') {
    if (mod.Main && typeof mod.Main.render === 'function') {
      Component = mod.Main;
    } else {
      return next(new Error(`Aucun composant avec une méthode render trouvé dans ${filePath}`));
    }
  }

  const { html } = Component.render(data);
  let htmlResponse = `<div id="${data.ssr}">${html}</div>`;

  if (data.hydration) {
    const model = data.dataForHydration ? data.dataForHydration : data;
    htmlResponse += `<script>window.${toSnakeCase(data.ssr)} = ${JSON.stringify(model)}</script>`;
  }

  // Injecter les fichiers CSS en ajoutant des balises <link>
  cssFiles.forEach((cssFile) => {
    htmlResponse = `<link rel="stylesheet" href="/static/${cssFile}" />` + htmlResponse;
  });

  // Injecter le script client en utilisant le fichier déterminé par le manifest
  htmlResponse += `<script type="module" src="/static/${clientEntryFile}"></script>`;

  next(null, htmlResponse);
}
