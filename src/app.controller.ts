import { Controller, Get, Render } from '@nestjs/common';
import { CategoriesService } from './api/categories/categories.service.js';
import { TransactionsService } from './api/transactions/transactions.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService:CategoriesService
  ) {}

  @Get()
  @Render('ssr-main')
  async getHome() {
    const transactions = await this.transactionsService.findAll();
    const groupedTransactions = await this.transactionsService.findTransactionsGroupedByMonth(0, 10);
    const categories = await this.categoriesService.findAll();

    return {
      ssr: 'main_component',
      hydration: true,
      dataForHydration: {
        message: 'Hello from SSR!',
        groupedTransactions: groupedTransactions,
        transactions: transactions,  // Inclure les transactions dans les données
        categories: categories
      },
    };
  }
}
