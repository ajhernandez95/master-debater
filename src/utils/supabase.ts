import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseApiUrl = process.env.REACT_APP_SUPABASE_TEST_API_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_TEST_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(
  supabaseApiUrl,
  supabaseAnonKey
);
