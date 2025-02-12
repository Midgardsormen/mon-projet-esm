import apiClient from "../../../../libs/shared/src/client/api-client.js";


export async function fetchTotalBalance(): Promise<number> {
    try {
      const response = await apiClient.get('/transactions/total-balance');
      return response.data;  // On retourne uniquement la valeur du solde
    } catch (err) {
      console.error('Error fetching total balance:', err);
      return 0;  // En cas d’erreur, on retourne 0 par défaut
    }
  }