import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Trophy, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamStats {
  budget: number;
  total_points?: number;
  players_count: number;
  team_id?: string;
}

export function Dashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      try {
        const { data: team, error: teamError } = await supabase
          .from('user_teams')
          .select('id, budget')
          .eq('user_id', user.id)
          .single();

        if (teamError && teamError.code !== 'PGRST116') throw teamError;

        if (team) {
          const [{ count: playersCount }, { data: scores }] = await Promise.all([
            supabase.from('team_players').select('*', { count: 'exact', head: true }).eq('team_id', team.id),
            supabase.from('team_scores').select('points').eq('team_id', team.id)
          ]);

          const totalPoints = scores?.reduce((sum, s) => sum + (s.points || 0), 0) || 0;

          setStats({
            budget: team.budget,
            total_points: totalPoints,
            players_count: playersCount || 0,
            team_id: team.id
          });
        } else {
          setStats({ budget: 100, players_count: 0, total_points: 0 });
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  if (loading) {
    return <div className="text-center py-24 text-[var(--fpl-purple)] font-bold animate-pulse">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg shadow-md border-l-8 border-[var(--fpl-pink)] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--fpl-purple)] p-3 rounded-lg text-white">
            <Trophy className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--fpl-purple)] uppercase tracking-tight">Fantasy Labama Dashboard</h1>
            <p className="text-slate-500 font-medium">Gameweek 1 - Deadline: Sat 16 Aug 11:00</p>
          </div>
        </div>
        <Link 
          to="/build"
          className="fpl-button-primary flex items-center gap-2 whitespace-nowrap"
        >
          {stats?.players_count === 15 ? 'View My Team' : 'Pick Your Squad'}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points & Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="fpl-card p-6 flex flex-col justify-between h-32">
              <span className="text-xs font-bold text-slate-500 uppercase">Points</span>
              <span className="text-4xl font-black text-[var(--fpl-purple)]">{stats?.total_points || 0}</span>
            </div>
            <div className="fpl-card p-6 flex flex-col justify-between h-32">
              <span className="text-xs font-bold text-slate-500 uppercase">Avg Points</span>
              <span className="text-4xl font-black text-[var(--fpl-purple)]">0</span>
            </div>
            <div className="fpl-card p-6 flex flex-col justify-between h-32">
              <span className="text-xs font-bold text-slate-500 uppercase">Highest Points</span>
              <span className="text-4xl font-black text-[var(--fpl-purple)]">0</span>
            </div>
          </div>

          <div className="fpl-card">
            <div className="bg-[var(--fpl-purple)] text-white px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold uppercase tracking-wider text-sm">Gameweek 1 Status</h2>
              <TrendingUp className="h-5 w-5 text-[var(--fpl-green)]" />
            </div>
            <div className="p-8 text-center">
              <div className="mb-6 inline-flex bg-slate-100 p-4 rounded-full">
                <Calendar className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-[var(--fpl-purple)] mb-2">The season hasn't started yet!</p>
              <p className="text-slate-500 max-w-sm mx-auto">Make sure your squad is ready before the first kickoff. You can make unlimited transfers until the first deadline.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="fpl-card">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold uppercase tracking-wider text-xs text-[var(--fpl-purple)]">My Leagues</h2>
            </div>
            <div className="p-0">
              <div className="px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--fpl-purple)]">Global League</span>
                  <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded text-slate-600">-</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500 mb-4">You are not in any private leagues.</p>
                <Link to="/leagues" className="text-sm font-bold text-[var(--fpl-pink)] hover:underline">Create or join a league</Link>
              </div>
            </div>
          </div>

          <div className="fpl-card bg-[var(--fpl-purple)] text-white p-6">
            <h2 className="font-black text-xl mb-2 uppercase italic">Join the Fantasy Community</h2>
            <p className="text-slate-300 text-sm mb-4">Compete with millions of managers around the world and win exclusive prizes.</p>
            <Link to="/leagues" className="block text-center bg-[var(--fpl-green)] text-[var(--fpl-purple)] font-black py-3 rounded uppercase text-sm">Join Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}