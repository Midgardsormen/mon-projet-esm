export interface CreateTransactionDto {
    id?:string;
    amount: number;
    type: 'income' | 'expense';
    category_id: string;
    description?: string;
    date: string;
  }
  
  export interface CreateCategoryDto {
    id?:string;
    type: 'income' | 'expense';
    name: string;
    parent_id?: string;
  }


  export interface Transaction {
    id?:string;
    amount: number;
    type: 'income' | 'expense';
    category: CategoryWithChildren;
    description?: string;
    date: string;
  }

  export interface GroupedTransaction {
    monthYear:string;
    transactions: Transaction[];
  }

  export interface GroupedTransactionsResponse {
    groups:GroupedTransaction[];
    hasMore: boolean;
  }

  export interface CategoryWithChildren {
    id: string;
    name: string;
    type: 'income' | 'expense';
    parent_id: string | null;
    icon_label:  string | null;
    icon_color:  string | null;
    children: CategoryWithChildren[]; // tableau récursif
  }