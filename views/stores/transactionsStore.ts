import { writable } from 'svelte/store';
import type { GroupedTransaction, Transaction } from 'types/interfaces.js';

// Initialisez le store avec des données vides ou avec des données d'hydratation initiales
export const transactions = writable<Transaction[]>([]);
export const groupedTransactions = writable<GroupedTransaction[]>([]);