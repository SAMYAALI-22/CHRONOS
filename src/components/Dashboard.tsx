import { Cpu, Database, AlertTriangle, Activity } from 'lucide-react';
import { SystemMetrics } from '../types';

interface DashboardProps {
  metrics: SystemMetrics | null;
}

export default function Dashboard({ metrics }: DashboardProps) {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'CALM': return 'text-green-400 border-green-500';
      case 'UNEASY': return 'text-yellow-400 border-yellow-500';
      case 'PANIC': return 'text-red-400 border-red-500';
      default: return 'text-slate-400 border-slate-500';
    }
  };

  const getMoodGlow = (mood: string) => {
    switch (mood) {
      case 'CALM': return 'shadow-green-500/50';
      case 'UNEASY': return 'shadow-yellow-500/50';
      case 'PANIC': return 'shadow-red-500/50 animate-pulse';
      default: return 'shadow-slate-500/50';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 40) return 'from-green-600 to-green-400';
    if (risk <= 70) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  return (
    <section className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4 tracking-wide">
            Live <span className="text-amber-400">Intelligence</span> Dashboard
          </h2>
          <p className="text-slate-400 text-lg">Real-time predictive cloud stability monitoring</p>
        </div>

        {metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{metrics.cpu.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-300 text-sm font-medium">CPU Usage</h3>
                {metrics.cpu > 70 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(metrics.cpu, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <Database className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">{metrics.memory.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-300 text-sm font-medium">Memory Usage</h3>
                {metrics.memory > 70 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(metrics.memory, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">{metrics.failure_risk.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-300 text-sm font-medium">Failure Risk</h3>
                {metrics.failure_risk > 70 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse heartbeat"></div>}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getRiskColor(metrics.failure_risk)} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(metrics.failure_risk, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className={`bg-slate-800 rounded-2xl p-6 border-2 ${getMoodColor(metrics.system_mood)} transition-all duration-300 shadow-xl ${getMoodGlow(metrics.system_mood)}`}>
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8" />
                <span className={`text-2xl font-bold ${getMoodColor(metrics.system_mood)}`}>
                  {metrics.system_mood}
                </span>
              </div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">System Mood</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{metrics.reason}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            <p className="text-slate-400 mt-4">Initializing Chronos Intelligence...</p>
          </div>
        )}

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-amber-400" />
            System Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">CALM (0-40%)</h4>
              <p className="text-xs text-slate-400">System operating normally with stable resource utilization and no concerning trends.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">UNEASY (41-70%)</h4>
              <p className="text-xs text-slate-400">Elevated resource usage or concerning trends detected. Monitoring recommended.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2">PANIC (71-100%)</h4>
              <p className="text-xs text-slate-400">Critical resource levels or dangerous trends. Immediate attention required.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
