import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricDataPoint } from '../types';
import { Activity } from 'lucide-react';

interface MetricsChartProps {
  data: MetricDataPoint[];
}

export default function MetricsChart({ data }: MetricsChartProps) {
  const formattedData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-3 shadow-lg">
          <p className="text-slate-300 text-sm">{data.time}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name}: {entry.value.toFixed(1)}
              {entry.dataKey === 'cpu' || entry.dataKey === 'memory' ? '%' : ''}
              {entry.dataKey === 'traffic' ? ' req/s' : ''}
              {entry.dataKey === 'load' ? '' : ''}
            </p>
          ))}
          {data.isSpike && <p className="text-yellow-400 text-xs mt-1">Spike Detected!</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Activity className="w-6 h-6 text-blue-400 pulse-glow" />
        Real-Time Metrics Timeline
      </h3>

      <div className="bg-slate-900 rounded-xl p-4 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
              name="CPU Usage (%)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#a855f7"
              dot={false}
              strokeWidth={2}
              name="Memory Usage (%)"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-900/30 border border-blue-500/50 rounded p-3">
          <p className="text-blue-300 font-semibold mb-1">CPU Trend</p>
          <p className="text-slate-300">{data.length > 0 ? data[data.length - 1].cpu.toFixed(1) : '0'}%</p>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/50 rounded p-3">
          <p className="text-purple-300 font-semibold mb-1">Memory Trend</p>
          <p className="text-slate-300">{data.length > 0 ? data[data.length - 1].memory.toFixed(1) : '0'}%</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-3">
          <p className="text-yellow-300 font-semibold mb-1">Spikes Detected</p>
          <p className="text-slate-300">{data.filter(d => d.isSpike).length}</p>
        </div>
      </div>
    </div>
  );
}
