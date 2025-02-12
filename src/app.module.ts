import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './api/transactions/transactions.module.js';
import { AppController } from './app.controller.js';
import { SupabaseService } from '../libs/shared/src/services/supabase/supabase.service.js';
import { CategoriesModule } from './api/categories/categories.module.js';
import { AuthController } from './auth/auth.controller.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionsModule,
    CategoriesModule
  ],
  controllers: [AppController, AuthController],
  providers: [SupabaseService],
})
export class AppModule {}

