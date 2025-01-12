import { Controller, Get, Render } from '@nestjs/common';
import { SupabaseService } from '../libs/shared/src/services/supabase/supabase.service.js'; 

@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  @Render('ssr-main')
  async getHome() {
    // Récupérer les transactions via Supabase pour le composant Home
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) {
      throw new Error(error.message);
    }

    return {
      ssr: 'main_component',
      hydration: true,
      dataForHydration: {
        message: 'Hello from SSR!',
        transactions: data,  // Inclure les transactions dans les données
      },
    };
  }
}
