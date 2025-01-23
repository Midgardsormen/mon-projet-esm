import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        if (!supabaseUrl) {
          throw new Error('Missing env var SUPABASE_URL');
        }
        
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
        if (!supabaseKey) {
          throw new Error('Missing env var SUPABASE_KEY');
        }
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    getClient() {
        return this.supabase;
    }
}
