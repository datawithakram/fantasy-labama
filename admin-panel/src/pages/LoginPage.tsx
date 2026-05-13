import React, { useState } from 'react';
import { Trophy, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get credentials from environment variables
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

    setTimeout(() => { // Small delay to simulate processing
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        localStorage.setItem('admin_session', 'active_hq_session');
        window.location.reload(); // Refresh to update App.tsx state
      } else {
        setError('Invalid credentials. Access denied.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6">
            <Trophy className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">لابطاما <span className="text-indigo-400">HQ</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">دخول آمن للمشرفين</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">البريد الإلكتروني للمدير</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
                  placeholder="admin@labama.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">المفتاح السري</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="glow-button w-full py-4 text-sm group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  دخول مركز التحكم 
                  <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          الدخول مقتصر على الموظفين المصرح لهم فقط.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
