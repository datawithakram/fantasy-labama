import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, UserPlus, Zap, Shield, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(`[Auth] Initiating ${isSignUp ? 'Registration' : 'Login'} for:`, email);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        console.log('[Auth] Supabase signUp success:', data.user?.id);

        if (data.user) {
          const { error: insertError } = await supabase.from('users').insert({
            id: data.user.id,
            username: email.split('@')[0],
            provider: 'email'
          });
          
          setSuccess(true);
          console.log('[Auth] User profile registration initiated, awaiting verification');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log('[Auth] Login success:', data.user?.id);
      }
    } catch (err: any) {
      console.error('[Auth] Authentication failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="max-w-md w-full fantasy-card p-10 text-center space-y-6 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-emerald-500 animate-bounce" />
           </div>
           <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Check your inbox</h2>
              <p className="text-[var(--muted-foreground)] font-bold text-sm mt-3 leading-relaxed">
                We've sent a verification link to <span className="text-[var(--primary)]">{email}</span>. 
                Please verify your account to start building your squad.
              </p>
           </div>
           <button 
             onClick={() => setSuccess(false)}
             className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[var(--primary)]/20 hover:scale-105 transition-all"
           >
             Back to Login
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Brand Column */}
      <div className="md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="z-10 text-center">
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] inline-block mb-8 shadow-2xl border border-white/10">
              <Trophy className="h-20 w-20 text-[var(--primary)]" />
           </div>
           <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none text-white">Fantasy <span className="text-[var(--primary)]">Labama</span></h1>
           <p className="text-2xl text-white/40 font-bold uppercase tracking-[0.3em] italic">The Game is On</p>
        </div>
        
        {/* Animated Background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] opacity-10 -mr-48 -mt-48 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 opacity-5 -ml-[250px] -mb-[250px] rounded-full blur-3xl"></div>
      </div>

      {/* Form Column */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-[var(--card)]">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-[var(--foreground)] uppercase italic tracking-tight mb-3">
              {!isSignUp ? 'Welcome <span className="text-[var(--primary)]">Back</span>' : 'Join the <span className="text-[var(--primary)]">Arena</span>'}
            </h2>
            <p className="text-[var(--muted-foreground)] font-bold text-sm">Experience the most advanced fantasy manager on the market.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 p-5 rounded-2xl mb-8 text-xs font-black uppercase tracking-tight flex items-center gap-4 animate-in shake duration-500">
              <Shield className="h-6 w-6 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-[var(--primary)] transition-colors">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-[var(--muted)] border-none rounded-2xl pl-12 pr-4 py-4 text-[var(--foreground)] font-bold placeholder-[var(--muted-foreground)]/50 focus:ring-2 focus:ring-[var(--primary)] transition-all"
                     placeholder="e.g. manager@labama.com"
                     required
                   />
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-[var(--primary)] transition-colors">Security Key</label>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-[var(--muted)] border-none rounded-2xl pl-12 pr-4 py-4 text-[var(--foreground)] font-bold placeholder-[var(--muted-foreground)]/50 focus:ring-2 focus:ring-[var(--primary)] transition-all"
                     placeholder="••••••••"
                     required
                   />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-[var(--primary)]/30 flex items-center justify-center gap-3 uppercase italic text-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                 </div>
              ) : (!isSignUp ? <><LogIn className="h-5 w-5" /> Access Arena</> : <><UserPlus className="h-5 w-5" /> Create Identity</>)}
            </button>
          </form>

          <div className="mt-12 text-center pt-10 border-t border-[var(--border)]">
            <p className="text-[var(--muted-foreground)] font-bold text-sm mb-5">
              {!isSignUp ? "Don't have an identity yet?" : "Already an arena member?"}
            </p>
            <button
              onClick={() => {
                 setIsSignUp(!isSignUp);
                 setError(null);
              }}
              className="text-[var(--primary)] hover:text-[var(--foreground)] font-black uppercase tracking-[0.2em] text-[10px] transition-all border-b-2 border-[var(--primary)]/20 hover:border-[var(--primary)] pb-1"
            >
              {!isSignUp ? 'Establish New Account' : 'Return to Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}