import axios from 'axios';


// Créez une instance Axios avec une base URL pour vos API
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour supprimer une transaction
export async function deleteTransaction(id: string): Promise<void> {
  try {
    await apiClient.delete(`/transactions/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to delete transaction:', error.response?.data || error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
}
