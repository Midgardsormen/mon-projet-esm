import { writable } from 'svelte/store';
import type { CreateTransactionDto } from 'types/interfaces.js';

// Initialisez le store avec des données vides ou avec des données d'hydratation initiales
export const transactions = writable<CreateTransactionDto[]>([]);
