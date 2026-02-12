import { SystemMetrics } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchMetrics(): Promise<SystemMetrics> {
  const apiUrl = `${SUPABASE_URL}/functions/v1/chronos-metrics`;

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });


  return await response.json();
}
