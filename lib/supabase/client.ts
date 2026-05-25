import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihidmclkugsmoygegipp.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWRtY2xrdWdzbW95Z2VnaXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDQ1NTQsImV4cCI6MjA5NTEyMDU1NH0.wx4UylX3Bm3Ku4m7scftIE5wntj3x1ELS5zNXtCbX6Q';

  client = createBrowserClient(supabaseUrl, anonKey);
  return client;
}
