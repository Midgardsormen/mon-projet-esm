import { SupabaseService } from '../../../libs/shared/src/services/supabase/supabase.service.js';
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('home')
  @Render('ssr-home')
  async getHome() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) {
      throw new Error(error.message);
    }
    // On retourne l’objet qui sera injecté dans la vue Svelte
    return {
      ssr: 'home_component',
      hydration: true,
      dataForHydration: {
        transactions: data ,
      },
    };;
  }
}

