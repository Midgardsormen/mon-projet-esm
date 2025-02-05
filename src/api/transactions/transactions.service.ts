import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../dto/create-transaction.dto.js';
import type { Transaction } from '../../../types/interfaces.js';


@Injectable()
export class TransactionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Transaction[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('transactions').select(`*,category:categories (*)`);
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

  async create(createTransactionDto: CreateTransactionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .insert([createTransactionDto])
      .select();
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
      .select(`*, category:categories (*)`);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .select();
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
