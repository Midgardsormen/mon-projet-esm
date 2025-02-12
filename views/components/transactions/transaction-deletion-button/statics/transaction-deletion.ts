import axios from 'axios';
import apiClient from '../../../../../libs/shared/src/client/api-client.js';
import type { CreateTransactionDto, Transaction } from 'types/interfaces.js';



// Fonction pour supprimer une transaction
export async function deleteTransaction(id: string): Promise<CreateTransactionDto[]> {
  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to delete transaction:', error.response?.data || error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
}
