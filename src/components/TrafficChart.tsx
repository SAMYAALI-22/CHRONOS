import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MetricDataPoint } from '../types';
import { TrendingUp } from 'lucide-react';

interface TrafficChartProps {
  data: MetricDataPoint[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const formattedData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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
              {entry.dataKey === 'traffic' ? ' req/s' : ' load avg'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const avgTraffic = data.length > 0 ? (data.reduce((sum, d) => sum + d.traffic, 0) / data.length).toFixed(0) : '0';
  const maxTraffic = data.length > 0 ? Math.max(...data.map(d => d.traffic)).toFixed(0) : '0';
  const avgLoad = data.length > 0 ? (data.reduce((sum, d) => sum + d.load, 0) / data.length).toFixed(2) : '0';

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-green-400" />
        Traffic & Load Analysis
      </h3>

      <div className="bg-slate-900 rounded-xl p-4 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="traffic"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorTraffic)"
              strokeWidth={2}
              name="Traffic (req/s)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="load"
              stroke="#f59e0b"
              dot={false}
              strokeWidth={2}
              yAxisId="right"
              name="System Load"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-green-900/30 border border-green-500/50 rounded p-3">
          <p className="text-green-300 font-semibold mb-1">Avg Traffic</p>
          <p className="text-slate-300">{avgTraffic} req/s</p>
        </div>
        <div className="bg-orange-900/30 border border-orange-500/50 rounded p-3">
          <p className="text-orange-300 font-semibold mb-1">Peak Traffic</p>
          <p className="text-slate-300">{maxTraffic} req/s</p>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/50 rounded p-3">
          <p className="text-amber-300 font-semibold mb-1">Avg Load</p>
          <p className="text-slate-300">{avgLoad}</p>
        </div>
      </div>
    </div>
  );
}
