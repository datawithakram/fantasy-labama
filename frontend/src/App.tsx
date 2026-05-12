import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { TeamBuilder } from './pages/TeamBuilder';
import { Transfers } from './pages/Transfers';
import { MatchCenter } from './pages/MatchCenter';
import { Leaderboard } from './pages/Leaderboard';
import { Leagues } from './pages/Leagues';
import { Profile } from './pages/Profile';
import Auth from './pages/Auth';
import { History } from './pages/History';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { registerPush } from './lib/pushManager';
import { Layout, Users, Repeat, Trophy, BarChart2, User, Sun, Moon, Zap } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  const { setUser } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session) registerPush();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session) registerPush();
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {session && (
          <>
            {/* Top Logo Bar */}
            <div className="bg-[var(--primary)] text-white py-4 px-6 flex justify-between items-center shadow-lg relative z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Labama <span className="text-white/60">Fantasy</span></h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Gameweek 12 • Active</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <NavLink to="/profile" className="flex items-center gap-3 bg-white/10 pl-4 pr-2 py-1 rounded-full border border-white/10 hover:bg-white/20 transition-all group">
                   <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">My Team</p>
                     <p className="text-xs font-black truncate max-w-[80px]">{(session.user.email as string).split('@')[0]}</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center overflow-hidden shadow-md">
                      <User className="w-4 h-4" />
                   </div>
                </NavLink>
              </div>
            </div>

            {/* Main Navigation - Hidden on mobile, shown on desktop */}
            <nav className="hidden md:block bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
              <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
                <NavLink to="/" className={({isActive}) => `nav-link h-16 shrink-0 ${isActive ? 'nav-link-active !bg-transparent border-b-4 border-[var(--primary)] rounded-none' : ''}`}>
                  <Layout className="w-5 h-5" /> <span>My Team</span>
                </NavLink>
                <NavLink to="/transfers" className={({isActive}) => `nav-link h-16 shrink-0 ${isActive ? 'nav-link-active !bg-transparent border-b-4 border-[var(--primary)] rounded-none' : ''}`}>
                  <Repeat className="w-5 h-5" /> <span>Transfers</span>
                </NavLink>
                <NavLink to="/matches" className={({isActive}) => `nav-item h-16 shrink-0 nav-link ${isActive ? 'nav-link-active !bg-transparent border-b-4 border-[var(--primary)] rounded-none' : ''}`}>
                  <BarChart2 className="w-5 h-5" /> <span>Match Center</span>
                </NavLink>
                <NavLink to="/leagues" className={({isActive}) => `nav-link h-16 shrink-0 ${isActive ? 'nav-link-active !bg-transparent border-b-4 border-[var(--primary)] rounded-none' : ''}`}>
                  <Trophy className="w-5 h-5" /> <span>Leagues</span>
                </NavLink>
                <NavLink to="/history" className={({isActive}) => `nav-link h-16 shrink-0 ${isActive ? 'nav-link-active !bg-transparent border-b-4 border-[var(--primary)] rounded-none' : ''}`}>
                   <Users className="w-5 h-5" /> <span>History</span>
                </NavLink>
              </div>
            </nav>
          </>
        )}

        <main className={`flex-1 ${session ? 'max-w-6xl mx-auto w-full p-4 md:p-8' : ''}`}>
          <Routes>
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
            <Route path="/" element={session ? <TeamBuilder /> : <Navigate to="/auth" />} />
            <Route path="/transfers" element={session ? <Transfers /> : <Navigate to="/auth" />} />
            <Route path="/matches" element={session ? <MatchCenter /> : <Navigate to="/auth" />} />
            <Route path="/leaderboard" element={session ? <Leaderboard /> : <Navigate to="/auth" />} />
            <Route path="/leagues" element={session ? <Leagues /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/history" element={session ? <History /> : <Navigate to="/auth" />} />
          </Routes>
        </main>

        {session && (
          <>
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)]/80 backdrop-blur-xl border-t border-[var(--border)] px-2 py-3 z-50 flex justify-around items-center pb-safe">
              <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
                <Layout className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Team</span>
              </NavLink>
              <NavLink to="/transfers" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
                <Repeat className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Transfers</span>
              </NavLink>
              <NavLink to="/matches" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
                <BarChart2 className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Matches</span>
              </NavLink>
              <NavLink to="/leagues" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
                <Trophy className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Leagues</span>
              </NavLink>
              <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
                <User className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
              </NavLink>
            </nav>

            <footer className="hidden md:block bg-[var(--card)] border-t border-[var(--border)] py-10 mt-20">
              <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 opacity-60">
                <div>
                   <h3 className="font-black italic uppercase tracking-tighter text-lg mb-4">Labama <span className="text-[var(--primary)]">Fantasy</span></h3>
                   <p className="text-xs leading-relaxed">The ultimate fantasy football experience. Compete with friends and win prizes in the most realistic league management game.</p>
                </div>
                <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest">
                  <p>Terms of Service</p>
                  <p>Privacy Policy</p>
                  <p>Cookie Settings</p>
                </div>
                <div className="text-right flex flex-col justify-between">
                   <div className="flex justify-end gap-4">
                      <div className="w-8 h-8 bg-[var(--muted)] rounded-lg"></div>
                      <div className="w-8 h-8 bg-[var(--muted)] rounded-lg"></div>
                      <div className="w-8 h-8 bg-[var(--muted)] rounded-lg"></div>
                   </div>
                   <p className="text-[10px] mt-6">© 2026 Labama Sports Engine. All Rights Reserved.</p>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;