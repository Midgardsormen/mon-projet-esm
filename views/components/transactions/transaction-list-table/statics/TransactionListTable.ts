import axios from 'axios';
import type { CreateTransactionDto, GroupedTransactionsResponse, Transaction } from 'types/interfaces.js';
import { supabase } from '../../../../../libs/shared/src/client/supabase/supabase.js';
import apiClient from '../../../../../libs/shared/src/client/api-client.js';


  export async function fetchTransactions() {  
     const { data: { session }, error } = await supabase.auth.getSession();
     const token = session?.access_token;
     console.log('${token}', token)
    try {
      const response = await apiClient.get('/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }});
      // S'assure que ce soit un tableau, même si la base est vide
      const data = Array.isArray(response.data) ? response.data : [];
      return data; // <-- éventuellement retourner le tableau si tu en as besoin
    } catch (err) {
      console.error('Error fetching transactions:', err);
      // En cas d'erreur, on met un tableau vide
      return [];
    }
  }

  export async function fetchGroupedTransactions(page = 0, limit = 10): Promise<GroupedTransactionsResponse> {
    const { data: { session }, error } = await supabase.auth.getSession();
    const token = session?.access_token;
    try {
      const response = await fetch(`/api/transactions/grouped?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }});
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des transactions groupées');
      }
      const groupedData: GroupedTransactionsResponse = await response.json();
      return groupedData;
    } catch (error) {
      console.error("Erreur dans fetchGroupedTransactions :", error);
      throw error; // On relance l'erreur pour que l'appelant puisse la gérer également
    }
  }

  export async function updateTransaction(transactionId:string, data: Partial<CreateTransactionDto>): Promise<Transaction[]> {
    try {
      const response = await apiClient.patch(`/transactions/${transactionId}`, data);
      return response.data;
    }  catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to create transaction:', error.response?.data || error.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }