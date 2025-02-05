import axios, { AxiosError } from "axios";
import { categories } from "../../../stores/categoriesStore.js";
import type { CategoryWithChildren } from "types/interfaces.js";

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export async function fetchCategories(): Promise<CategoryWithChildren[]> {
    try {
      const response = await apiClient.get<CategoryWithChildren[]>('/categories');
      console.log(response)
      const data = response.data;
  
      if (!Array.isArray(data)) {
        console.error('Données reçues inattendues :', data);
        categories.set([]);
        return [];
      }
  
      categories.set(data);
      
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erreur Axios lors de la récupération des catégories :', error.response?.data || error.message);
      } else {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
  
      categories.set([]);
      return [];
    }
  }

  export async function fetchCategoryById(id: string): Promise<CategoryWithChildren | null> {
    try {
      const response = await apiClient.get<CategoryWithChildren>(`/categories/${id}`);
      const data = response.data;
  
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erreur Axios lors de la récupération d’une catégorie :', error.response?.data || error.message);
      } else {
        console.error('Erreur lors de la récupération d’une catégorie :', error);
      }
  
      return null;
    }
  }

  