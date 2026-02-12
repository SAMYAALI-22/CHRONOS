import { Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMGgydjMwem0wIDMwaDJWMzBoLTJ2MzB6TTAgMThoMzB2Mkgwdi0yem0zMCAwaDB2MmgzMHYtMkgzMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Clock className="w-24 h-24 text-amber-500 animate-spin-slow" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 animate-ping opacity-20">
              <Clock className="w-24 h-24 text-amber-500" />
            </div>
          </div>
        </div>

        <h1 className="text-8xl font-bold mb-6 tracking-wider chronos-title">
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 text-transparent bg-clip-text drop-shadow-2xl">
            CHRONOS
          </span>
        </h1>

        <p className="text-2xl text-amber-200 mb-4 font-light tracking-widest opacity-90">
          GUARDIAN OF CLOUD STABILITY
        </p>

        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>

        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
          Inspired by the Greek god of time, Chronos brings time-awareness to cloud infrastructure.
          Monitoring the present, analyzing the past, predicting the future.
        </p>

        <div className="flex justify-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-Time Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Predictive Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span>Risk Intelligence</span>
          </div>
        </div>

        <div className="mt-16 animate-bounce">
          <svg className="w-8 h-8 mx-auto text-amber-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}
