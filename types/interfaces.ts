export interface CreateTransactionDto {
    id?:string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
  }

  export interface CreateCategoryDto {
    id?:string;
    type: 'income' | 'expense';
    name: string;
    parent_id?: string;
  }

  export interface CategoryWithChildren {
    id: string;
    name: string;
    type: 'income' | 'expense';
    parent_id: string | null;
    children: CategoryWithChildren[]; // tableau récursif
  }