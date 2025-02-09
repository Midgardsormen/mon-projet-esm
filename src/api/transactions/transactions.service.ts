import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../dto/create-transaction.dto.js';
import type { Transaction } from '../../../types/interfaces.js';


@Injectable()
export class TransactionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Transaction[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select(`*,category:categories (*)`)
      .order('date', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    data?.forEach(transaction => {
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });
    return data;
  }

  async findTransactionsGroupedByMonth(page: number, limit: number) {
    const supabase = this.supabaseService.getClient();
  
    // Récupération paginée des transactions triées par date décroissante
    const { data, error, count } = await supabase
      .from('transactions')
      .select(`*, category:categories (*)`, { count: "exact" })
      .order('date', { ascending: false })
      .limit(limit)
      .range(page * limit, page * limit + limit - 1);
  
    if (error) {
      throw new Error(error.message);
    }
  
    // (Optionnel) Conversion de la couleur pour chaque transaction si nécessaire
    data?.forEach(transaction => {
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });
  
    // Grouper les transactions par mois/année
    const grouped = data.reduce((acc, transaction) => {
      // On suppose que transaction.date est une string au format ISO (YYYY-MM-DD)
      const date = new Date(transaction.date);
      // Récupérer le nom du mois en français
      const monthName = date.toLocaleString('fr-FR', { month: 'long' });
      const year = date.getFullYear();
      const key = `${monthName} ${year}`; // ex. "janvier 2025"
  
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transaction);
      return acc;
    }, {} as { [key: string]: any[] });
  
    // Transformer l'objet en tableau pour un rendu plus simple côté client
    const groupedArray = Object.keys(grouped).map(key => ({
      monthYear: key,
      transactions: grouped[key]
    }));
  
    // Trier le tableau par ordre décroissant (en fonction de la date de la première transaction de chaque groupe)
    groupedArray.sort((a, b) => {
      const dateA = new Date(a.transactions[0].date);
      const dateB = new Date(b.transactions[0].date);
      return dateB.getTime() - dateA.getTime();
    });
    const hasMore = (count !== null && (page + 1) * limit < count);

    return { groups: groupedArray, hasMore }
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .insert([createTransactionDto])
      .select()
      .order('date', { ascending: false });;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async update(id: string, updateData: Partial<CreateTransactionDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select(`*, category:categories (*)`)
      .order('date', { ascending: false });;
    if (error) {
      throw new Error(error.message);
    }
    data?.forEach(transaction => {
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .select()
      .order('date', { ascending: false });;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  private hexToRgbString(hex: string): string {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r},${g},${b}`;
  }

}
