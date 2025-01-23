export interface CreateTransactionDto {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
  }