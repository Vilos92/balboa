import {SupabaseClient, createClient} from '@supabase/supabase-js';

/*
 * Types.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/*
 * Constants.
 */

const envUrl = process.env.PUBLIC_SUPABASE_URL ?? '';
const envAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/*
 * Client.
 */

/**
 * @returns a function which itself returns the existing supabase
 * client, or creates a new supabase client.
 */
function makeSupabaseClientFactory() {
  let supabase: SupabaseClient | undefined;

  return (supabaseConfig?: SupabaseConfig): SupabaseClient => {
    if (supabase) return supabase;

    const config = supabaseConfig ?? {url: envUrl, anonKey: envAnonKey};

    supabase = createClient(config.url, config.anonKey);
    return supabase;
  };
}

export const makeSupabaseClient = makeSupabaseClientFactory();
