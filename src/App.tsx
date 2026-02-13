import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Game from './components/Game';
import Footer from './components/Footer';
import { fetchMetrics } from './services/api';
import { SystemMetrics, MetricDataPoint } from './types';

function App() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<MetricDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const detectSpikes = (current: SystemMetrics, previous: MetricDataPoint | null): boolean => {
    if (!previous) return false;
    const cpuChange = Math.abs(current.cpu - previous.cpu);
    const memoryChange = Math.abs(current.memory - previous.memory);
    const trafficChange = Math.abs(current.traffic - previous.traffic);
    return cpuChange > 15 || memoryChange > 15 || trafficChange > 200;
  };

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const data = await fetchMetrics();
        setMetrics(data);

        setMetricsHistory(prev => {
          const lastPoint = prev[prev.length - 1];
          const isSpike = detectSpikes(data, lastPoint);
          const newPoint: MetricDataPoint = {
            timestamp: data.timestamp,
            cpu: data.cpu,
            memory: data.memory,
            traffic: data.traffic,
            load: data.load,
            failure_risk: data.failure_risk,
            isSpike
          };

          const updated = [...prev, newPoint];
          return updated.slice(-30);
        });

        setError(null);
      } catch (err) {
        setError('Failed to fetch metrics');
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
      <Analytics data={metricsHistory} />
      <Game failureRisk={metrics?.failure_risk || 0} />
      <Footer />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500 text-red-200 px-6 py-3 rounded-lg shadow-xl">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
