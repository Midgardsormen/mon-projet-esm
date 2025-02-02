import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';




@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService, SupabaseService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
