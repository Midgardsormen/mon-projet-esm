import { writable } from 'svelte/store';
import type { CategoryWithChildren } from 'types/interfaces.js';

// Initialisez le store avec des données vides ou avec des données d'hydratation initiales
export const categories = writable<CategoryWithChildren[]>([]);
