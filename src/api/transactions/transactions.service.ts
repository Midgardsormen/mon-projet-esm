import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../dto/create-transaction.dto.js';
import type { Transaction } from '../../../types/interfaces.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Récupère toutes les transactions pour un utilisateur donné.
   */
  async findAllForUser(userId: string): Promise<Transaction[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select(`*,category:categories (*)`)
      .eq('user_id', userId)                        // <-- filtrage par user_id
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    data?.forEach(transaction => {
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      }
      // Conversion de couleur
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });
    return data;
  }

  /**
   * Récupérer les transactions groupées par mois/année avec pagination (pour userId).
   */
  async findTransactionsGroupedByMonth(userId: string, page: number, limit: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error, count } = await supabase
      .from('transactions')
      .select(`*, category:categories (*)`, { count: "exact" })
      .eq('user_id', userId)                        // <-- filtrage par user_id
      .order('date', { ascending: false })
      .limit(limit)
      .range(page * limit, page * limit + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    data?.forEach(transaction => {
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      }
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });

    // Grouper par mois/année
    const grouped = data.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthName = date.toLocaleString('fr-FR', { month: 'long' });
      const year = date.getFullYear();
      const key = `${monthName} ${year}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transaction);
      return acc;
    }, {} as { [key: string]: any[] });

    const groupedArray = Object.keys(grouped).map(key => ({
      monthYear: key,
      transactions: grouped[key]
    }));

    // Tri décroissant
    groupedArray.sort((a, b) => {
      const dateA = new Date(a.transactions[0].date);
      const dateB = new Date(b.transactions[0].date);
      return dateB.getTime() - dateA.getTime();
    });

    const hasMore = (count !== null && (page + 1) * limit < count);
    return { groups: groupedArray, hasMore };
  }

  /**
   * Calculer le solde total pour un utilisateur donné.
   */
  async getTotalBalance(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId);                       // <-- filtrage par user_id

    if (error) {
      throw new Error('Failed to fetch transactions: ' + error.message);
    }

    const totalBalance = data.reduce((acc: number, transaction: { amount: number; type: string }) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    
    return totalBalance;
  }

  /**
   * Créer une transaction pour un utilisateur donné.
   */
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const supabase = this.supabaseService.getClient();
    // On insère le user_id en même temps que les autres champs
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        ...createTransactionDto
      }])
      .select()
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    data?.forEach(transaction => {
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      }
    });
    return data;
  }

  /**
   * Mettre à jour UNE transaction dont l’id et le user_id correspondent.
   */
  async update(userId: string, id: string, updateData: Partial<CreateTransactionDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)         // <-- vérifier que ça appartient à l’utilisateur !
      .select(`*, category:categories (*)`)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    data?.forEach(transaction => {
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      }
      if (transaction.category?.icon_color) {
        transaction.category.icon_color = this.hexToRgbString(transaction.category.icon_color);
      }
    });
    return data;
  }

  /**
   * Supprimer UNE transaction appartenant à l’utilisateur donné.
   */
  async delete(userId: string, id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)         // <-- vérifier le user_id
      .select()
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    data?.forEach(transaction => {
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      }
    });
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
