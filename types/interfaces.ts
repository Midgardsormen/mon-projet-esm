export interface CreateTransactionDto {
    id?:string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
  }