import { useState } from 'react';
import { MetricDataPoint } from '../types';
import MetricsChart from './MetricsChart';
import TrafficChart from './TrafficChart';
import RiskForecast from './RiskForecast';
import { Play, RotateCcw, Pause } from 'lucide-react';

interface AnalyticsProps {
  data: MetricDataPoint[];
}

export default function Analytics({ data }: AnalyticsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelinePosition, setTimelinePosition] = useState(100);

  const visibleDataPoints = Math.floor((data.length * timelinePosition) / 100);
  const displayedData = data.slice(0, Math.max(1, visibleDataPoints));

  const handleReset = () => {
    setTimelinePosition(100);
    setIsPlaying(true);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimelinePosition(Number(e.target.value));
    setIsPlaying(false);
  };

  return (
    <section className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 tracking-wide">
            Enterprise <span className="text-amber-400">Analytics</span> Suite
          </h2>
          <p className="text-slate-400 text-lg">Intelligent monitoring with predictive insights and spike detection</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Timeline Control</h3>
              <span className="text-sm text-slate-400">{Math.round(timelinePosition)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={timelinePosition}
              onChange={handleTimelineChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${timelinePosition}%, #334155 ${timelinePosition}%, #334155 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Start</span>
              <span>{displayedData.length} / {data.length} data points</span>
              <span>Live</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <MetricsChart data={displayedData} />
          <TrafficChart data={displayedData} />
          <RiskForecast data={displayedData} />
        </div>

        <div className="mt-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">Intelligent Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h4 className="text-blue-400 font-semibold mb-2">Spike Detection</h4>
              <p className="text-slate-300 text-sm">
                Automatically identifies unusual patterns and rapid changes in system metrics. Each spike is marked on the forecast chart for easy correlation with events.
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h4 className="text-green-400 font-semibold mb-2">Predictive Forecasting</h4>
              <p className="text-slate-300 text-sm">
                Uses historical trends to project future risk levels with dashed forecast lines. Enables proactive decision-making before issues occur.
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h4 className="text-amber-400 font-semibold mb-2">Timeline Slider</h4>
              <p className="text-slate-300 text-sm">
                Rewind through historical data to analyze past events or pause live streaming to focus on specific time windows. Perfect for root cause analysis.
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h4 className="text-red-400 font-semibold mb-2">Correlation Analysis</h4>
              <p className="text-slate-300 text-sm">
                See how CPU, memory, traffic, and load work together to influence failure risk. Multi-dimensional view for comprehensive understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </section>
  );
}
