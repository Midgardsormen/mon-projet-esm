import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './api/categories/categories.service.js';
import { TransactionsService } from './api/transactions/transactions.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';
import type { Request } from 'express';
import { OptionnalCookieAuthGuard } from './guards/optionnal-cookie-auth.guard.js';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}


@Controller()
@UseGuards(OptionnalCookieAuthGuard)
export class AppController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService:CategoriesService
  ) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get()
  @Render('ssr-main')
  async getHome(@Req() req: RequestWithUser) {
    const userId = req.user?.id?req.user.id:null;
    const transactions = userId ? await this.transactionsService.findAllForUser(userId): {};
    const groupedTransactions = userId ? await this.transactionsService.findTransactionsGroupedByMonth(userId,0, 10): {};
    const totalBalance = userId ? await this.transactionsService.getTotalBalance(userId): {};

    console.log('totalBalance', totalBalance)
    const categories = await this.categoriesService.findAll();

    return {
      ssr: 'main_component',
      hydration: true,
      dataForHydration: {
        message: 'Hello from SSR!',
        groupedTransactions: groupedTransactions,
        transactions: transactions,
        totalBalance: totalBalance,
        categories: categories
      },
    };
  }
}
