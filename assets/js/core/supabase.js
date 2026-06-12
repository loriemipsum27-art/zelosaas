import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://zxczmbcjjohyghskvlfh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y3ptYmNqam9oeWdoc2t2bGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzIyNDMsImV4cCI6MjA5MzkwODI0M30.drnfReEhmCR1G2bWo3uJAFY2ZKdJD-nWLnfK-i1RUY8';

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default sb;
