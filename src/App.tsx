import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Footer from './components/Footer';
import { fetchMetrics } from './services/api';
import { SystemMetrics } from './types';

const FALLBACK_METRICS: SystemMetrics = {
  cpu: 17.3,
  memory: 42.4,
  failure_risk: 0,
  system_mood: 'CALM',
  reason: 'System operating normally',
  timestamp: Date.now(),
};

function App() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        // Keep showing the last successful sample if available.
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        console.error(err);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      <Dashboard metrics={metrics} />
      <Game failureRisk={metrics?.failure_risk || 0} />
      <Footer />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500 text-red-200 px-6 py-3 rounded-lg shadow-xl">
          {metrics
            ? `Live feed interrupted. Showing last real sample. ${error}`
            : error}
        </div>
      )}
    </div>
  );
}

export default App;
