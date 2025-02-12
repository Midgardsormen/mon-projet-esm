// apiClient.ts
import axios from 'axios';
import { supabase } from './supabase/supabase.js'; 
// <-- adapter le chemin vers ta config Supabase

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor qui s'exécute avant chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    // Récupérer la session depuis Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // Si on a un token, on le met dans le header Authorization
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    // En cas d'erreur dans l'interceptor
    return Promise.reject(error);
  }
);

export default apiClient;
