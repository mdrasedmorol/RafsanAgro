import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bocrzajgbljkkbkubwfk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvY3J6YWpnYmxqa2tia3Vid2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODg2MTUsImV4cCI6MjA2NzU2NDYxNX0.placeholder';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvY3J6YWpnYmxqa2tia3Vid2ZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk4ODYxNSwiZXhwIjoyMDY3NTY0NjE1fQ.L_ajGT08FohUcWP0vU8G6NDB6xAG7RqVPjxvGQxvFAI';

// Client for public operations (Browser & Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations with full database access (Server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
