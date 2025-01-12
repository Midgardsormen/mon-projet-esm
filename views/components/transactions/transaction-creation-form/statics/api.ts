import axios from 'axios';

// Créez une instance Axios avec une base URL pour vos API
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour créer une transaction
export async function createTransaction(data) {
  try {
    const response = await apiClient.post('/transactions', data);
    return JSON.parse(response.config.data);
  } catch (error) {
    console.error('Failed to create transaction:', error.response?.data || error.message);
    throw error;
  }
}
