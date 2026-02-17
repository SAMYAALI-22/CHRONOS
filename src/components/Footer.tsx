import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">CHRONOS</h3>
          <p className="text-slate-400 text-sm">Guardian of Cloud Stability</p>
        </div>

        <div className="border-t border-slate-800 pt-8 mb-8">
          <h4 className="text-center text-amber-400 font-semibold mb-6">Founded By</h4>
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-amber-500 transition-all duration-300">
              <h5 className="text-xl font-bold text-white mb-2">Samya Ali</h5>
              <p className="text-slate-400 text-sm mb-4">Founder & Cloud Architect</p>
              <div className="flex gap-4 justify-center">
                <a href="https://github.com/SAMYAALI-22" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/samyaali22/" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:samyaali648@gmail.com" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
      

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-amber-500 transition-all duration-300">
              <h5 className="text-xl font-bold text-white mb-2">Ashish Aryan</h5>
              <p className="text-slate-400 text-sm mb-4">Managing Director</p>
              <div className="flex gap-4 justify-center">
                <a href="https://github.com/SAMYAALI-22" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/samyaali22/" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:samyaali648@gmail.com" className="text-slate-400 hover:text-amber-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">
          <p>&copy; 2026 CHRONOS. Predictive Cloud Intelligence Platform.</p>
          <p className="mt-2">Transforming reactive monitoring into proactive stability</p>
        </div>
      </div>
    </footer>
  );
}
