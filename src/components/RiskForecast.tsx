import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MetricDataPoint } from '../types';
import { AlertTriangle } from 'lucide-react';

interface RiskForecastProps {
  data: MetricDataPoint[];
}

export default function RiskForecast({ data }: RiskForecastProps) {
  const generateForecast = (historical: MetricDataPoint[]): any[] => {
    if (historical.length < 2) return [];

    const lastRisk = historical[historical.length - 1]?.failure_risk || 0;
    const prevRisk = historical[historical.length - 2]?.failure_risk || lastRisk;
    const trend = (lastRisk - prevRisk);

    const forecast = [];
    for (let i = 1; i <= 5; i++) {
      const projectedRisk = Math.max(0, Math.min(100, lastRisk + trend * i * 0.8));
      forecast.push({
        timestamp: historical[historical.length - 1].timestamp + i * 2000,
        time: `+${i * 2}s`,
        failure_risk: lastRisk,
        forecast: projectedRisk,
        isForecast: true
      });
    }
    return forecast;
  };

  const forecast = generateForecast(data);
  const combinedData = [
    ...data.map(d => ({
      ...d,
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      forecast: d.failure_risk,
      isForecast: false
    })),
    ...forecast
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-3 shadow-lg">
          <p className="text-slate-300 text-sm">{data.time}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.dataKey === 'failure_risk' ? 'Current Risk' : 'Predicted Risk'}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const detectSpikes = (data: MetricDataPoint[]): any[] => {
    return data.filter(d => d.isSpike).map(d => ({
      timestamp: d.timestamp,
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
  };

  const spikes = detectSpikes(data);
  const currentRisk = data.length > 0 ? data[data.length - 1].failure_risk : 0;
  const riskTrend = data.length > 1 ? data[data.length - 1].failure_risk - data[data.length - 2].failure_risk : 0;
  const isRising = riskTrend > 0.5;

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        Risk Prediction & Spike Detection
      </h3>

      <div className="bg-slate-900 rounded-xl p-4 mb-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <ReferenceLine
              y={40}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{ value: 'CALM (40%)', position: 'insideTopLeft', offset: 10, fill: '#10b981' }}
            />
            <ReferenceLine
              y={70}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'PANIC (70%)', position: 'insideTopLeft', offset: -10, fill: '#f59e0b' }}
            />

            {spikes.map((spike, idx) => (
              <ReferenceLine
                key={idx}
                x={spike.time}
                stroke="#ef4444"
                strokeDasharray="3 3"
                opacity={0.5}
              />
            ))}

            <Line
              type="monotone"
              dataKey="failure_risk"
              stroke="#ef4444"
              dot={false}
              strokeWidth={3}
              name="Current Risk"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#a78bfa"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
              name="Predicted Risk (Forecast)"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border ${currentRisk > 70 ? 'bg-red-900/30 border-red-500/50' : currentRisk > 40 ? 'bg-yellow-900/30 border-yellow-500/50' : 'bg-green-900/30 border-green-500/50'}`}>
          <p className={`font-semibold mb-1 ${currentRisk > 70 ? 'text-red-300' : currentRisk > 40 ? 'text-yellow-300' : 'text-green-300'}`}>
            Current Risk Score
          </p>
          <p className="text-2xl font-bold text-slate-200">{currentRisk.toFixed(1)}%</p>
        </div>

        <div className={`rounded-lg p-4 border ${isRising ? 'bg-red-900/30 border-red-500/50' : 'bg-green-900/30 border-green-500/50'}`}>
          <p className={`font-semibold mb-1 ${isRising ? 'text-red-300' : 'text-green-300'}`}>
            Risk Trend
          </p>
          <p className={`text-2xl font-bold ${isRising ? 'text-red-400' : 'text-green-400'}`}>
            {isRising ? '↑' : '↓'} {Math.abs(riskTrend).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-lg p-4 border bg-amber-900/30 border-amber-500/50">
          <p className="font-semibold mb-1 text-amber-300">Spike Events</p>
          <p className="text-2xl font-bold text-slate-200">{spikes.length}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <p className="text-sm text-slate-400">
          {currentRisk > 70 ? '⚠️ Critical risk levels detected. Immediate attention required.' : currentRisk > 40 ? '⚡ Moderate risk detected. Monitoring recommended.' : '✓ System stable. Continue monitoring.'}
        </p>
      </div>
    </div>
  );
}
