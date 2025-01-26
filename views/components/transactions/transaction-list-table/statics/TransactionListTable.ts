import axios from 'axios';
import { transactions } from '../../stores/transactionsStore.js';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export async function fetchTransactions() {
    try {
      const response = await apiClient.get('/transactions');
      // S'assure que ce soit un tableau, même si la base est vide
      const data = Array.isArray(response.data) ? response.data : [];
      transactions.set(data);
      return data; // <-- éventuellement retourner le tableau si tu en as besoin
    } catch (err) {
      console.error('Error fetching transactions:', err);
      // En cas d'erreur, on met un tableau vide
      transactions.set([]);
      return [];
    }
  }