import { writable } from 'svelte/store';

// Initialisez le store avec des données vides ou avec des données d'hydratation initiales
export const transactions = writable([]);
