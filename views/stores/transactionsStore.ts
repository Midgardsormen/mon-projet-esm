import { writable } from 'svelte/store';
import type { Transaction } from 'types/interfaces.js';

// Initialisez le store avec des données vides ou avec des données d'hydratation initiales
export const transactions = writable<Transaction[]>([]);
