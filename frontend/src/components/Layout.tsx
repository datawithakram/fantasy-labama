import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Trophy, Home, Users, ArrowRightLeft, Activity, ListOrdered, Medal, LogOut, Menu, X, BellRing } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/build', label: 'Squad Selection', icon: Users },
  { path: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
  { path: '/live', label: 'Match Center', icon: Activity },
  { path: '/leagues', label: 'Leagues & Cups', icon: ListOrdered },
  { path: '/leaderboard', label: 'Leaderboard', icon: Medal },
];

export function Layout() {
  const { pathname } = useLocation();
  const { signOut, user } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const channel = supabase.channel('public:match_events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'match_events' }, (payload) => {
        setNotification({
          title: 'Live Match Event!',
          message: `A new ${payload.new.event_type} was recorded.`
        });
        setTimeout(() => setNotification(null), 5000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col font-sans relative">
      {/* Live Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[var(--fpl-green)] text-[var(--fpl-purple)] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 border-2 border-[var(--fpl-purple)]" data-testid="live-notification">
          <BellRing className="h-6 w-6 animate-bounce" />
          <div>
            <p className="font-black uppercase text-sm">{notification.title}</p>
            <p className="font-bold text-xs">{notification.message}</p>
          </div>
        </div>
      )}

      {/* FPL Style Header */}
      <header className="fpl-header shrink-0">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-full">
                <Trophy className="h-8 w-8 text-[#37003c]" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">Fantasy Labama</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--fpl-green)] flex items-center justify-center text-[var(--fpl-purple)] font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              )}
              <button 
                onClick={handleSignOut}
                className="text-sm font-semibold hover:text-[var(--fpl-green)] transition-colors flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "fpl-nav-item border-b-4 border-transparent",
                    isActive && "bg-[var(--fpl-green)] text-[var(--fpl-purple)] border-[var(--fpl-green)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--fpl-purple)] text-white p-4 border-t border-white/10">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-bold",
                  pathname === item.path ? "bg-[var(--fpl-green)] text-[var(--fpl-purple)]" : "hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="px-4 py-3 rounded-md text-sm font-bold text-red-400 hover:bg-red-500/10 text-left"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--fpl-purple)] text-white py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[var(--fpl-green)]" />
            <span className="font-bold">Fantasy Labama</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 Fantasy Labama. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}