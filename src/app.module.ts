import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './api/transactions/transactions.module.js';
import { AppController } from './app.controller.js';
import { SupabaseService } from '../libs/shared/src/services/supabase/supabase.service.js';
import { CategoriesModule } from './api/categories/categories.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionsModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [SupabaseService],
})
export class AppModule {}

