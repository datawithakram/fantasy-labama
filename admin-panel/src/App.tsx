import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Players from './pages/Players';
import Matches from './pages/Matches';
import MatchEvents from './pages/MatchEvents';
import Groups from './pages/Groups';
import GameControl from './pages/GameControl';
import LeagueManager from './pages/LeagueManager';
import { Home, Shield, Users, Calendar, Activity, LayoutGrid, Settings, Trophy, LogOut, Search, Bell, Loader2, Menu, X } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'active_hq_session') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex relative overflow-x-hidden">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 glass-panel border-r border-white/5 p-6 shrink-0 flex flex-col z-[70] transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                 <Trophy className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Labama <span className="text-indigo-400">HQ</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Center</p>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
            <NavLink to="/" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Home className="w-5 h-5" /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/control" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Settings className="w-5 h-5" /> <span>Game Control</span>
            </NavLink>
            <NavLink to="/leagues" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Trophy className="w-5 h-5" /> <span>Leagues</span>
            </NavLink>
            
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-8 mb-4 px-2">Data Management</p>
            <NavLink to="/clubs" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Shield className="w-5 h-5" /> <span>Clubs</span>
            </NavLink>
            <NavLink to="/players" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Users className="w-5 h-5" /> <span>Players</span>
            </NavLink>
            <NavLink to="/matches" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Calendar className="w-5 h-5" /> <span>Matches</span>
            </NavLink>
            <NavLink to="/events" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <Activity className="w-5 h-5" /> <span>Match Events</span>
            </NavLink>
            <NavLink to="/groups" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <LayoutGrid className="w-5 h-5" /> <span>Groups</span>
            </NavLink>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="nav-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" /> <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Top Header */}
          <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-[50]">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5 w-64 lg:w-96">
                <Search className="w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Global Search..." className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-3 lg:gap-6">
              <button className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-white/5">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold">Admin User</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase">Super Admin</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shrink-0"></div>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8 flex-1 w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/control" element={<GameControl />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/leagues" element={<LeagueManager />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/players" element={<Players />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/events" element={<MatchEvents />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
