import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './api/transactions/transactions.module.js';
import { AppController } from './app.controller.js';
import { SupabaseService } from '../libs/shared/src/services/supabase/supabase.service.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [SupabaseService],
})
export class AppModule {}

