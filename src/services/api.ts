import { SystemMetrics } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchMetrics(): Promise<SystemMetrics> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Create a .env file with both values.');
  }
  
  const apiUrl = `${SUPABASE_URL}/functions/v1/chronos-metrics`;

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Metrics request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}
