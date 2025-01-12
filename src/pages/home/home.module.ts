import { Module } from '@nestjs/common';
import { HomeController } from './home.controller.js';
import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';

@Module({
  controllers: [HomeController],
  providers: [SupabaseService],
})
export class HomeModule {}
