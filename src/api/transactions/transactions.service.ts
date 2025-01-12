import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto.js';


@Injectable()
export class TransactionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('transactions')
      .insert([createTransactionDto]);
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
      .eq('id', id);
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
      .eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
