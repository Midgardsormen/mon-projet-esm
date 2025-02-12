import axios from 'axios';
import apiClient from '../../../../../libs/shared/src/client/api-client.js';
import type { CreateTransactionDto } from 'types/interfaces.js';

// Créez une instance Axios avec une base URL pour vos API

// Fonction pour créer une transaction
export async function createTransaction(data:CreateTransactionDto): Promise<CreateTransactionDto[]> {
  try {
    const response = await apiClient.post('/transactions', data);
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
