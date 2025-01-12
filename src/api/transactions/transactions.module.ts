import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';




@Module({
  imports: [],
  controllers: [TransactionsController],
  providers: [TransactionsService, SupabaseService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
