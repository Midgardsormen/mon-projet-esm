import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error('Missing env var SUPABASE_URL');
}

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error('Missing env var SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);